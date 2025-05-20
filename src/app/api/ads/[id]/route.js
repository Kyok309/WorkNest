import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const ad = await prisma.ad.findUnique({
            where: {
                id: id
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
                        profileImage: true,
                        email: true,
                        phoneNum: true
                    }
                },
                comments: {
                    include: {
                        writer: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                profileImage: true
                            }
                        }
                    }
                }
            }
        });

        if (!ad) {
            return NextResponse.json(
                { error: 'Ad not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(ad);
    } catch (error) {
        console.error('Error fetching ad:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ad' },
            { status: 500 }
        );
    }
} 