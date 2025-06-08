import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [totalClients, totalServices, totalAds] = await Promise.all([
      prisma.client.count(),
      prisma.service.count(),
      prisma.ad.count(),
    ]);

    const fourWeeksAgo = subWeeks(new Date(), 4);
    
    const payments = await prisma.payment.findMany({
      where: {
        createdDate: {
          gte: fourWeeksAgo
        }
      },
      orderBy: {
        createdDate: 'asc'
      },
      select: {
        amount: true,
        createdDate: true
      }
    });

    const weeklyPayments = payments.reduce((acc, payment) => {
      const weekStart = format(startOfWeek(payment.createdDate), 'MMM dd');
      const weekEnd = format(endOfWeek(payment.createdDate), 'MMM dd');
      const weekKey = `${weekStart} - ${weekEnd}`;
      
      if (!acc[weekKey]) {
        acc[weekKey] = 0;
      }
      acc[weekKey] += payment.amount;
      return acc;
    }, {});

    const weeklyJobRequests = await Promise.all(
      Array.from({ length: 4 }, (_, i) => {
        const weekStart = startOfWeek(subWeeks(new Date(), i));
        const weekEnd = endOfWeek(subWeeks(new Date(), i));
        
        return prisma.$queryRaw`
          WITH LatestStates AS (
            SELECT rs.*
            FROM RequestState rs
            INNER JOIN (
              SELECT jobRequestId, MAX(createdDate) as maxDate
              FROM RequestState
              WHERE createdDate >= ${weekStart} AND createdDate <= ${weekEnd}
              GROUP BY jobRequestId
            ) latest ON rs.jobRequestId = latest.jobRequestId AND rs.createdDate = latest.maxDate
          )
          SELECT requestStateRefId, CAST(COUNT(requestStateRefId) AS SIGNED) as count
          FROM LatestStates
          GROUP BY requestStateRefId
        `;
      })
    );

    const ratings = await prisma.jobRating.groupBy({
      by: ['rating'],
      _count: {
        rating: true
      }
    });

    const distribution = Array(5).fill(0);
    ratings.forEach(rating => {
      distribution[rating.rating - 1] = rating._count.rating;
    });

    const processedWeeklyRatings = Array.from({ length: 4 }, (_, i) => ({
      week: format(startOfWeek(subWeeks(new Date(), i)), 'MMM dd'),
      distribution: [...distribution]
    }));

    return NextResponse.json({
      totalClients,
      totalServices,
      totalAds,
      weeklyPayments: Object.entries(weeklyPayments).map(([week, amount]) => ({
        week,
        amount
      })),
      weeklyJobRequests: weeklyJobRequests.map((states, index) => ({
        week: format(startOfWeek(subWeeks(new Date(), index)), 'MMM dd'),
        data: states.map(state => Number(state.count))
      })),
      weeklyRatings: processedWeeklyRatings
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 