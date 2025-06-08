import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = new Date(searchParams.get('startDate'));
        const endDate = new Date(searchParams.get('endDate'));

        const ads = await prisma.ad.findMany({
            where: {
                createdDate: {
                    gte: startDate,
                    lte: endDate
                }
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
                adJobs: {
                    include: {
                        adJobState: true
                    }
                },
                client: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            },
            orderBy: {
                createdDate: 'desc'
            }
        });

        return NextResponse.json(ads);
    } catch (error) {
        console.error('Error fetching ads report:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ads report' },
            { status: 500 }
        );
    }
} 