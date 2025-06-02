import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(request) {
    try {
        const data = await request.json();
        const { userId, adJobId } = data;

        // Check if a request already exists
        const existingRequest = await prisma.jobRequest.findFirst({
            where: {
                clientId: userId,
                adJobId: adJobId
            }
        });

        if (existingRequest) {
            return NextResponse.json(
                { error: 'You have already applied for this job' },
                { status: 400 }
            );
        }

        // Create new job request
        const jobRequest = await prisma.jobRequest.create({
            data: {
                id: nanoid(21),
                client: {
                    connect: {
                        id: userId
                    }
                },
                adJob: {
                    connect: {
                        id: adJobId
                    }
                },
                states: {
                    create: {
                        id: nanoid(21),
                        createdDate: new Date(),
                        requestStateRef: {
                            connect: {
                                id: 'cUoFt6mXyJrDqwNBLzA3K'
                            }
                        }
                    }
                }
            },
            include: {
                states: {
                    include: {
                        requestStateRef: true
                    },
                    orderBy: {
                        createdDate: 'desc'
                    },
                    take: 1
                }
            }
        });

        return NextResponse.json(jobRequest);
    } catch (error) {
        console.error('Error creating job request:', error);
        return NextResponse.json(
            { error: 'Failed to create job request' },
            { status: 500 }
        );
    }
} 