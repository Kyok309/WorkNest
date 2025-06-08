import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { nanoid } from "nanoid";

export async function GET() {
    try {
        const roles = await prisma.employeeRole.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return NextResponse.json(roles);
    } catch (error) {
        console.error("Error fetching employee roles:", error);
        return NextResponse.json(
            { error: 'Failed to fetch employee roles' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        const newRole = await prisma.employeeRole.create({
            data: {
                id: nanoid(21),
                name: data.name
            }
        });
        return NextResponse.json(newRole);
    } catch (error) {
        console.error("Error creating employee role:", error);
        return NextResponse.json(
            { error: 'Failed to create employee role' },
            { status: 500 }
        );
    }
}