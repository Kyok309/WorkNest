import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        await prisma.requestState.deleteMany({
            where: {
                jobRequestId: id
            }
        });

        await prisma.jobRequest.delete({
            where: {
                id: id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting job request:', error);
        return NextResponse.json(
            { error: 'Failed to delete job request' },
            { status: 500 }
        );
    }
} 