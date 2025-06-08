import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from "nanoid";

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

export async function POST(request) {
    try {
        const data = await request.json()
        const newRequestStateRef = await prisma.requestStateRef.create({
            data: {
                id: nanoid(21),
                name: data.name
            }
        });
        return NextResponse.json(newRequestStateRef);
    } catch (error) {
        console.error("Error creating request state ref:", error);
        return NextResponse.json(
            { error: 'Failed to create request state ref' },
            { status: 500 }
        );
    }
}