import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { clientID } = params;

        const completedJobs = await prisma.jobRequest.findMany({
            where: {
                clientId: clientID,
                states: {
                    some: {
                        requestStateRef: {
                            name: 'Дууссан'
                        }
                    }
                }
            },
            include: {
                adJob: {
                    include: {
                        ad: {
                            include: {
                                client: {
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
                },
                states: {
                    include: {
                        requestStateRef: true
                    },
                    orderBy: {
                        createdDate: 'desc'
                    },
                    take: 1
                },
                ratings: {
                    include: {
                        ratingType: true,
                        ratingCategory: true
                    }
                }
            },
            orderBy: {
                states: {
                    _count: 'desc'
                }
            }
        });

        return NextResponse.json(completedJobs);
    } catch (error) {
        console.error('Error fetching completed jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch completed jobs' },
            { status: 500 }
        );
    }
} 