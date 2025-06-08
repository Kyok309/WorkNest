import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
    try {
        const adJobStates = await prisma.adJobState.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return NextResponse.json(adJobStates);
    } catch (error) {
        console.error('Error fetching ad job states:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ad job states' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const newAdJobState = await prisma.adJobState.create({
            data: {
                id: nanoid(21),
                name: data.name
            }
        });
        return NextResponse.json(newAdJobState);
    } catch (error) {
        console.error("Error creating ad job state:", error);
        return NextResponse.json(
            { error: 'Failed to create ad job state' },
            { status: 500 }
        );
    }
}