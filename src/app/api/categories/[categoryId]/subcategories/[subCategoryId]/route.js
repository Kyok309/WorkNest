import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
    try {
        const { subCategoryId } = params;

        await prisma.subCategory.delete({
            where: {
                id: subCategoryId
            }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { subCategoryId } = params;
        const data = await request.json();

        const subCategory = await prisma.subCategory.update({
            where: {
                id: subCategoryId
            },
            data: {
                name: data.name
            }
        });

        return NextResponse.json(subCategory);
    } catch (error) {
        console.error("Error updating subcategory:", error);
        return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 });
    }
} 