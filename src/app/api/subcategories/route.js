import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const subcategories = await prisma.subCategory.findMany({
            include: {
                category: true
            }
        });

        return NextResponse.json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subcategories' },
            { status: 500 }
        );
    }
} 