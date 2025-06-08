import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
    try {
        const ratingCategories = await prisma.ratingCategory.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return NextResponse.json(ratingCategories);
    } catch (error) {
        console.error('Error fetching rating categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rating categories' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const newRatingCategory = await prisma.ratingCategory.create({
            data: {
                id: nanoid(),
                name: data.name
            }
        });
        return NextResponse.json(newRatingCategory);
    } catch (error) {
        console.error("Error creating rating category:", error);
        return NextResponse.json(
            { error: 'Failed to create rating category' },
            { status: 500 }
        );
    }
}