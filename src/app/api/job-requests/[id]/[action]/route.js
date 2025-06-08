import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function PUT(request, { params }) {
    try {
        const { id, action } = params;

        if (!['approve', 'reject'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
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
                        id: action === 'approve' 
                            ? 'cUoFt6mXyJrDqwNBLzA3K'
                            : 'cUoFt6mXyJrDqwNBLzA3L'
                    }
                }
            },
            include: {
                requestStateRef: true
            }
        });

        return NextResponse.json(newState);
    } catch (error) {
        console.error('Error updating job request:', error);
        return NextResponse.json(
            { error: 'Failed to update job request' },
            { status: 500 }
        );
    }
} 