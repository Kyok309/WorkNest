import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
    try {
        const { id, categoryId } = params;

        // Delete the category
        await prisma.adCategory.deleteMany({
            where: {
                AND: [
                    { adId: id },
                    { subCategoryId: categoryId }
                ]
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
} 