import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.employeeRole.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting employee role:", error);
        return NextResponse.json(
            { error: 'Failed to delete employee role' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const role = await prisma.employeeRole.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            }
        });

        return NextResponse.json(role);
    } catch (error) {
        console.error("Error updating employee role:", error);
        return NextResponse.json({ error: "Failed to update employee role" }, { status: 500 });
    }
} 