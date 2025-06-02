import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // First delete all associated request states
        await prisma.requestState.deleteMany({
            where: {
                jobRequestId: id
            }
        });

        // Then delete the job request
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