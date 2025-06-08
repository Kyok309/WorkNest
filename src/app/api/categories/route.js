import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                subCategories: true
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const newCategory = await prisma.category.create({
            data: {
                id: nanoid(21),
                name: data.name
            }
        });
        return NextResponse.json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}