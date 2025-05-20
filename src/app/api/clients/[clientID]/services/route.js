import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const services = await prisma.service.findMany({
            where: {
                clientId: params.clientID
            },
            include: {
                subcategory: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // Ensure all services have subcategory data
        const servicesWithSubcategory = services.map(service => {
            if (!service.subcategory) {
                console.warn(`Service ${service.id} is missing subcategory data`);
            }
            return service;
        });

        return NextResponse.json(servicesWithSubcategory);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: 'Failed to fetch services' },
            { status: 500 }
        );
    }
} 