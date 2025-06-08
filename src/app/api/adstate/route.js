import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
    try {
        const adStates = await prisma.adState.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return NextResponse.json(adStates);
    } catch (error) {
        console.error('Error fetching ad states:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ad states' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const newAdState = await prisma.adState.create({
            data: {
                id: nanoid(21),
                name: data.name
            }
        });
        return NextResponse.json(newAdState);
    } catch (error) {
        console.error("Error creating ad state:", error);
        return NextResponse.json(
            { error: 'Failed to create ad state' },
            { status: 500 }
        );
    }
}
