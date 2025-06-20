import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { lastname, firstname, email, password, phoneNum } = await request.json();

    if (!lastname || !firstname || !email || !password) {
      return NextResponse.json(
        { error: "Бүх талбарыг бөглөн бичих ёстой." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.client.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Уг имейлийг өөр хэрэглэгч ашиглаж байна." },
        { status: 400 }
      );
    }

    const existingPhoneNum = await prisma.client.findFirst({
      where: { phoneNum: parseInt(phoneNum.replace(/\D/g, '')) },
    });

    if (existingPhoneNum) {
      return NextResponse.json(
        { error: "Уг утасны дугаарыг өөр хэрэглэгч ашиглаж байна." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = `CL${nanoid(21)}`;

    const user = await prisma.client.create({
      data: {
        id,
        lastname,
        firstname,
        email,
        password: hashedPassword,
        avgRating: 0,
        education: "",
        pastExperience: "",
        phoneNum: parseInt(phoneNum.replace(/\D/g, '')),
        homeAddress: "",
        birthDate: new Date(),
        gender: "",
        registerNum: "",
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Амжилттай бүртгэгдлээ.", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Хэрэглэгч бүртгэхэд алдаа гарлаа." },
      { status: 500 }
    );
  }
} 