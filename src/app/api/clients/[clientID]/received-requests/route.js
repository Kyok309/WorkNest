import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { clientID } = params;

        const adJobs = await prisma.adJob.findMany({
            where: {
                ad: {
                    clientId: clientID
                },
                jobRequests: {
                    some: {}
                }
            },
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
                },
                jobRequests: {
                    include: {
                        states: {
                            include: {
                                requestStateRef: true
                            },
                            orderBy: {
                                createdDate: 'desc'
                            },
                            take: 1
                        },
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
        });

        return NextResponse.json(adJobs);
    } catch (error) {
        console.error('Error fetching received requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch received requests' },
            { status: 500 }
        );
    }
} 