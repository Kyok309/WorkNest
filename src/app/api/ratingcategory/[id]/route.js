import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params}) {
    try {
        const { id } = params;
        await prisma.ratingCategory.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting rating category:", error);
        return NextResponse.json(
            { error: 'Failed to delete rating category' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const ratingCategory = await prisma.ratingCategory.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            }
        });

        return NextResponse.json(ratingCategory);
    } catch (error) {
        console.error("Error updating rating category:", error);
        return NextResponse.json({ error: "Failed to update rating category" }, { status: 500 });
    }
}