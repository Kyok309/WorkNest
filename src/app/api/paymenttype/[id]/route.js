import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params}) {
    try {
        const { id } = params;
        await prisma.paymentType.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting payment type:", error);
        return NextResponse.json(
            { error: 'Failed to delete payment type' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const paymentType = await prisma.paymentType.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            }
        });

        return NextResponse.json(paymentType);
    } catch (error) {
        console.error("Error updating payment type:", error);
        return NextResponse.json({ error: "Failed to update payment type" }, { status: 500 });
    }
}