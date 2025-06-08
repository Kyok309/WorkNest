import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const payments = await prisma.payment.findMany({
            where: {
                OR: [
                    { jobOrdererId: userId },
                    { contractorId: userId }
                ]
            },
            include: {
                paymentType: {
                    select: {
                        name: true
                    }
                },
                jobRequest: {
                    select: {
                        id: true,
                        adJob: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdDate: 'desc'
            }
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payments' },
            { status: 500 }
        );
    }
} 