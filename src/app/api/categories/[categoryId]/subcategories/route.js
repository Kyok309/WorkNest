import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { categoryId } = params;

        const subcategories = await prisma.subCategory.findMany({
            where: {
                categoryId: categoryId
            },
            select: {
                id: true,
                name: true
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
