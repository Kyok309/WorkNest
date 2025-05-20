import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, title, description, imageURL, experienceYear, wageType, wage, clientId, subcategoryId } = body;

        const service = await prisma.service.create({
            data: {
                id,
                title,
                description,
                imageURL,
                experienceYear: parseFloat(experienceYear),
                wageType,
                wage: parseFloat(wage),
                clientId,
                subcategoryId
            },
            include: {
                subcategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json(
            { error: 'Failed to create service' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            include: {
                subcategory: {
                    include: {
                        category: true
                    }
                },
                client: true
            }
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: 'Failed to fetch services' },
            { status: 500 }
        );
    }
} 