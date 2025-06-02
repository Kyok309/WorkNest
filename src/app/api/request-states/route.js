import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const requestStates = await prisma.requestStateRef.findMany({
            orderBy: {
                id: 'asc'
            }
        });

        return NextResponse.json(requestStates);
    } catch (error) {
        console.error('Error fetching request states:', error);
        return NextResponse.json(
            { error: 'Failed to fetch request states' },
            { status: 500 }
        );
    }
} 