import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const ratingTypes = await prisma.ratingType.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return NextResponse.json(ratingTypes);
    } catch (error) {
        console.error('Error fetching rating types:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rating types' },
            { status: 500 }
        );
    }
} 