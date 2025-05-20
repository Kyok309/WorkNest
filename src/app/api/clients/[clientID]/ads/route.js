import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { clientID } = params;

        const ads = await prisma.ad.findMany({
            where: {
                clientId: clientID
            },
            include: {
                adCategories: {
                    include: {
                        subCategory: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                adJobs: true,
                client: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        profileImage: true
                    }
                }
            },
            orderBy: {
                createdDate: 'desc'
            }
        });

        return NextResponse.json(ads);
    } catch (error) {
        console.error('Error fetching client ads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch client ads' },
            { status: 500 }
        );
    }
} 