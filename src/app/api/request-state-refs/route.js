import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const requestStateRefs = await prisma.requestStateRef.findMany();
        return NextResponse.json(requestStateRefs);
    } catch (error) {
        console.error('Error fetching request state refs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch request state refs' },
            { status: 500 }
        );
    }
} 