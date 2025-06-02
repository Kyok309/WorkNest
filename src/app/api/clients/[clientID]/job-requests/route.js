import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { clientID } = params;

        const jobRequests = await prisma.jobRequest.findMany({
            where: {
                clientId: clientID
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
                }
            },
            orderBy: {
                states: {
                    _count: 'desc'
                }
            }
        });

        return NextResponse.json(jobRequests);
    } catch (error) {
        console.error('Error fetching client job requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch client job requests' },
            { status: 500 }
        );
    }
} 