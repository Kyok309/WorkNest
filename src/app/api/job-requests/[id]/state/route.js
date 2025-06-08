import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { requestStateRefId } = await request.json();

        const jobRequest = await prisma.jobRequest.findUnique({
            where: { id },
            include: {
                adJob: {
                    include: {
                        escrows: true,
                        ad: {
                            select: {
                                clientId: true
                            }
                        }
                    }
                },
                client: true
            }
        });

        if (!jobRequest) {
            return NextResponse.json(
                { error: 'Job request not found' },
                { status: 404 }
            );
        }

        const newState = await prisma.requestState.create({
            data: {
                id: nanoid(21),
                createdDate: new Date(),
                jobRequest: {
                    connect: {
                        id: id
                    }
                },
                requestStateRef: {
                    connect: {
                        id: requestStateRefId
                    }
                }
            },
            include: {
                requestStateRef: true
            }
        });

        if (newState.requestStateRef.name === 'Дууссан') {
            const escrow = jobRequest.adJob.escrows[0];
            if (!escrow) {
                return NextResponse.json(
                    { error: 'No escrow found for this job' },
                    { status: 400 }
                );
            }

            await prisma.payment.create({
                data: {
                    id: nanoid(21),
                    amount: jobRequest.adJob.wage,
                    escrow: {
                        connect: {
                            id: escrow.id
                        }
                    },
                    jobRequest: {
                        connect: {
                            id: jobRequest.id
                        }
                    },
                    jobOrderer: {
                        connect: {
                            id: jobRequest.adJob.ad.clientId
                        }
                    },
                    contractor: {
                        connect: {
                            id: jobRequest.clientId
                        }
                    },
                    paymentType: {
                        connect: {
                            id: 'YzXpRQf7mLBoJ9wE2cTNv'
                        }
                    }
                }
            });
        }

        return NextResponse.json(newState);
    } catch (error) {
        console.error('Error updating request state:', error);
        return NextResponse.json(
            { error: 'Failed to update request state' },
            { status: 500 }
        );
    }
} 