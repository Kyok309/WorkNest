import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const { clientID } = params;

        const jobRequests = await prisma.jobRequest.findMany({
            where: {
                OR: [
                    { clientId: clientID },
                    { adJob: { ad: { clientId: clientID } } }
                ]
            },
            include: {
                ratings: {
                    select: {
                        rating: true
                    }
                }
            }
        });

        let totalRating = 0;
        let ratingCount = 0;

        jobRequests.forEach(request => {
            request.ratings.forEach(rating => {
                totalRating += rating.rating;
                ratingCount++;
            });
        });

        const avgRating = ratingCount > 0 ? totalRating / ratingCount : 0;

        await prisma.client.update({
            where: {
                id: clientID
            },
            data: {
                avgRating
            }
        });

        return NextResponse.json({ avgRating });
    } catch (error) {
        console.error('Error updating average rating:', error);
        return NextResponse.json(
            { error: 'Failed to update average rating' },
            { status: 500 }
        );
    }
} 