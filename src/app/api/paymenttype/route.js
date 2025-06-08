import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
    try {
        const paymentTypes = await prisma.paymentType.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return NextResponse.json(paymentTypes);
    } catch (error) {
        console.error('Error fetching payment types:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment types' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const newPaymentType = await prisma.paymentType.create({
            data: {
                id: nanoid(21),
                name: data.name
            }
        });
        return NextResponse.json(newPaymentType);
    } catch (error) {
        console.error("Error creating payment type:", error);
        return NextResponse.json(
            { error: 'Failed to create payment type' },
            { status: 500 }
        );
    }
}