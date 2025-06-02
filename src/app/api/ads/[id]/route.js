import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const ad = await prisma.ad.findUnique({
            where: {
                id: id
            },
            include: {
                adCategories: {
                    include: {
                        subCategory: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                adJobs: {
                    include: {
                        jobRequests: {
                            include: {
                                client: {
                                    select: {
                                        id: true,
                                        firstname: true,
                                        lastname: true,
                                        profileImage: true,
                                        email: true,
                                        phoneNum: true
                                    }
                                },
                                states: {
                                    include: {
                                        requestStateRef: true
                                    },
                                    orderBy: {
                                        createdDate: 'desc'
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                },
                client: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        profileImage: true,
                        email: true,
                        phoneNum: true
                    }
                },
                comments: {
                    include: {
                        writer: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                profileImage: true
                            }
                        }
                    }
                }
            }
        });

        if (!ad) {
            return NextResponse.json(
                { error: 'Ad not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(ad);
    } catch (error) {
        console.error('Error fetching ad:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ad' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        // First, update the basic ad information
        const updatedAd = await prisma.ad.update({
            where: {
                id: id
            },
            data: {
                title: data.title,
                description: data.description,
                totalWage: data.totalWage,
            },
            include: {
                adCategories: {
                    include: {
                        subCategory: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                adJobs: true,
                client: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        profileImage: true,
                        email: true,
                        phoneNum: true
                    }
                }
            }
        });

        // Update jobs
        if (data.adJobs) {
            // Get existing jobs
            const existingJobs = await prisma.adJob.findMany({
                where: {
                    adId: id
                },
                include: {
                    escrows: true
                }
            });

            // Update or create jobs
            await Promise.all(data.adJobs.map(async (job, index) => {
                const wage = parseInt(job.wage) || 0;
                const vacancy = parseInt(job.vacancy) || 0;
                const calculatedTotalWage = wage * vacancy;

                const jobData = {
                    id: job.id || nanoid(),
                    title: job.title,
                    description: job.description,
                    vacancy: vacancy,
                    isExperienceRequired: Boolean(job.isExperienceRequired),
                    wage: wage,
                    totalWage: calculatedTotalWage,
                    startDate: new Date(job.startDate),
                    endDate: new Date(job.endDate),
                    adJobState: {
                        connect: {
                            id: 'VdKL0P7s9yn1CqTG4Fxru'
                        }
                    }
                };

                if (existingJobs[index]) {
                    const existingEscrow = existingJobs[index].escrows[0];
                    // Update existing job
                    return prisma.adJob.update({
                        where: {
                            id: existingJobs[index].id
                        },
                        data: {
                            ...jobData,
                            escrows: existingEscrow ? {
                                update: {
                                    where: {
                                        id: existingEscrow.id
                                    },
                                    data: {
                                        totalAmount: calculatedTotalWage
                                    }
                                }
                            } : undefined
                        }
                    });
                } else {
                    // Create new job
                    return prisma.adJob.create({
                        data: {
                            ...jobData,
                            adId: id,
                            escrows: {
                                create: {
                                    id: nanoid(21),
                                    amount: calculatedTotalWage,
                                    status: 'Төлбөр байршуулсан',
                                    modifiedDate: new Date()
                                }
                            }
                        }
                    });
                }
            }));

            // Delete any extra jobs that weren't updated
            if (existingJobs.length > data.adJobs.length) {
                await prisma.adJob.deleteMany({
                    where: {
                        id: {
                            in: existingJobs.slice(data.adJobs.length).map(job => job.id)
                        }
                    }
                });
            }
        }

        // Update categories if provided
        if (data.selectedSubcategories) {
            // Delete existing categories
            await prisma.adCategory.deleteMany({
                where: {
                    adId: id
                }
            });

            // Create new categories
            await Promise.all(data.selectedSubcategories.map(subcategoryId =>
                prisma.adCategory.create({
                    data: {
                        id: nanoid(21),
                        ad: {
                            connect: {
                                id: id
                            }
                        },
                        subCategory: {
                            connect: {
                                id: subcategoryId
                            }
                        }
                    }
                })
            ));
        }

        // Fetch the updated ad with all relations
        const finalAd = await prisma.ad.findUnique({
            where: {
                id: id
            },
            include: {
                adCategories: {
                    include: {
                        subCategory: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                adJobs: true,
                client: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        profileImage: true,
                        email: true,
                        phoneNum: true
                    }
                },
                comments: {
                    include: {
                        writer: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                profileImage: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(finalAd);
    } catch (error) {
        console.error('Error updating ad:', error);
        return NextResponse.json(
            { error: 'Failed to update ad' },
            { status: 500 }
        );
    }
} 