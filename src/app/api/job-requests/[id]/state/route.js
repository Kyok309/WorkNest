import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { requestStateRefId } = await request.json();

        // Create a new state for the request
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

        return NextResponse.json(newState);
    } catch (error) {
        console.error('Error updating request state:', error);
        return NextResponse.json(
            { error: 'Failed to update request state' },
            { status: 500 }
        );
    }
} 