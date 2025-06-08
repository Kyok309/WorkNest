import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.adState.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting ad state:", error);
        return NextResponse.json(
            { error: 'Failed to delete ad state' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const adState = await prisma.adState.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            }
        });

        return NextResponse.json(adState);
    } catch (error) {
        console.error("Error updating ad state:", error);
        return NextResponse.json({ error: "Failed to update ad state" }, { status: 500 });
    }
}
