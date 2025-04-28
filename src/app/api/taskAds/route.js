import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, detail, schedule, tasks } = await req.json();

    const newTaskAd = await prisma.taskAd.create({
      data: {
        name,
        detail,
        schedule: new Date(schedule),
        tasks: { create: tasks },
      },
    });

    return new Response(JSON.stringify(newTaskAd), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating task ad" }), { status: 500 });
  }
}
