import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

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