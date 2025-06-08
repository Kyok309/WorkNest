import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request) {
    try {
        const data = await request.json();
        
        const existingRating = await prisma.jobRating.findFirst({
            where: {
                jobRequestId: data.jobRequestId,
                ratingTypeId: data.ratingTypeId,
                ratingCategoryId: data.ratingCategoryId
            }
        });

        let rating;
        if (existingRating) {
            rating = await prisma.jobRating.update({
                where: {
                    id: existingRating.id
                },
                data: {
                    rating: data.rating,
                    description: data.description
                }
            });
        } else {
            rating = await prisma.jobRating.create({
                data: {
                    id: nanoid(21),
                    rating: data.rating,
                    description: data.description,
                    jobRequest: {
                        connect: {
                            id: data.jobRequestId
                        }
                    },
                    ratingType: {
                        connect: {
                            id: data.ratingTypeId
                        }
                    },
                    ratingCategory: {
                        connect: {
                            id: data.ratingCategoryId
                        }
                    }
                }
            });
        }

        return NextResponse.json(rating);
    } catch (error) {
        console.error('Error handling rating:', error);
        return NextResponse.json(
            { error: 'Failed to handle rating' },
            { status: 500 }
        );
    }
} 