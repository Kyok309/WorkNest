import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.requestStateRef.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting request state ref:", error);
        return NextResponse.json(
            { error: 'Failed to delete request state ref' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const requestState = await prisma.requestStateRef.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            }
        });

        return NextResponse.json(requestState);
    } catch (error) {
        console.error("Error updating request state:", error);
        return NextResponse.json({ error: "Failed to update request state" }, { status: 500 });
    }
}