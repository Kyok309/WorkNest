import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
    try {
        const body = await request.json();
        const { title, description, imageURL, experienceYear, wageType, wage, subcategoryId } = body;

        const service = await prisma.service.update({
            where: {
                id: params.serviceId
            },
            data: {
                title,
                description,
                imageURL,
                experienceYear: parseFloat(experienceYear),
                wageType,
                wage: parseFloat(wage),
                subcategoryId
            }
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json(
            { error: 'Failed to update service' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const service = await prisma.service.delete({
            where: {
                id: params.serviceId
            }
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json(
            { error: 'Failed to delete service' },
            { status: 500 }
        );
    }
} 