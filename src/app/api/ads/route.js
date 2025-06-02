import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        
        const requiredAdFields = [
            'title',
            'description',
            'totalWage',
        ];

        for (const field of requiredAdFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Заавал оруулах талбар дутуу байна: ${field}` },
                    { status: 400 }
                );
            }
        }

        const requiredJobFields = [
            'title',
            'description',
            'vacancy',
            'wage',
            'startDate',
            'endDate',
        ];

        if (!body.adJobs || !Array.isArray(body.adJobs) || body.adJobs.length === 0) {
            return NextResponse.json(
                { error: 'Дор хаяж нэг ажлын байр шаардлагатай' },
                { status: 400 }
            );
        }

        if (!body.selectedSubcategories || !Array.isArray(body.selectedSubcategories) || body.selectedSubcategories.length === 0) {
            return NextResponse.json(
                { error: 'Дор хаяж нэг ангилал сонгох шаардлагатай' },
                { status: 400 }
            );
        }

        for (const job of body.adJobs) {
            for (const field of requiredJobFields) {
                if (!job[field]) {
                    return NextResponse.json(
                        { error: `Ажлын байрны заавал оруулах талбар дутуу байна: ${field}` },
                        { status: 400 }
                    );
                }
            }
        }

        const result = await prisma.$transaction(async (prisma) => {
            const ad = await prisma.ad.create({
                data: {
                    id: nanoid(21),
                    title: body.title,
                    description: body.description,
                    totalWage: parseFloat(body.totalWage),
                    createdDate: new Date(),
                    adStateId: 'V1StGXR8_Z5jdHi6B-myT', // Default state ID
                    clientId: body.clientId, // This should come from the authenticated user
                },
            });

            const adJobs = await Promise.all(
                body.adJobs.map(job => {
                    // Ensure we have valid numbers
                    const wage = parseFloat(job.wage) || 0;
                    const vacancy = parseInt(job.vacancy) || 0;
                    const totalAmount = parseFloat(job.totalAmount) || wage * vacancy;

                    return prisma.adJob.create({
                        data: {
                            id: nanoid(21),
                            title: job.title,
                            description: job.description,
                            vacancy: vacancy,
                            isExperienceRequired: job.isExperienceRequired || false,
                            wage: wage,
                            totalWage: totalAmount,
                            startDate: new Date(job.startDate),
                            endDate: new Date(job.endDate),
                            adJobStateId: 'VdKL0P7s9yn1CqTG4Fxru',
                            adId: ad.id,
                            escrows: {
                                create: {
                                    id: nanoid(21),
                                    totalAmount: totalAmount,
                                    state: 'Төлбөр байршуулсан',
                                    modifiedDate: new Date()
                                }
                            }
                        },
                    });
                })
            );

            const adCategories = await Promise.all(
                body.selectedSubcategories.map(subcategory =>
                    prisma.adCategory.create({
                        data: {
                            id: nanoid(21),
                            ad: {
                                connect: {
                                    id: ad.id
                                }
                            },
                            subCategory: {
                                connect: {
                                    id: subcategory
                                }
                            }
                        },
                    })
                )
            );

            return { ad, adJobs, adCategories };
        });

        return NextResponse.json(
            { 
                message: 'Зар болон ажлын байр амжилттай үүслээ',
                data: result 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Зар үүсгэхэд алдаа гарлаа:', error);
        return NextResponse.json(
            { error: 'Зар үүсгэхэд алдаа гарлаа' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const ads = await prisma.ad.findMany({
            include: {
                client: true,
                adJobs: true,
                adCategories: {
                    include: {
                        subCategory: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdDate: 'desc'
            }
        });

        return NextResponse.json(ads);
    } catch (error) {
        console.error('Error fetching ads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ads' },
            { status: 500 }
        );
    }
} 