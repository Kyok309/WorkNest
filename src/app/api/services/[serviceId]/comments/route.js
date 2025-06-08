import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(request, { params }) {
    try {
        const { serviceId } = params;
        const { content, userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        const comment = await prisma.serviceComment.create({
            data: {
                id: nanoid(21),
                comment: content,
                service: {
                    connect: {
                        id: serviceId
                    }
                },
                writer: {
                    connect: {
                        id: userId
                    }
                }
            },
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
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
