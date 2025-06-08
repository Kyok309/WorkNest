import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.adJobState.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting ad job state:", error);
        return NextResponse.json(
            { error: 'Failed to delete ad job state' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const adJobState = await prisma.adJobState.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            }
        });

        return NextResponse.json(adJobState);
    } catch (error) {
        console.error("Error updating ad job state:", error);
        return NextResponse.json({ error: "Failed to update ad job state" }, { status: 500 });
    }
}
