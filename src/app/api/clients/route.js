import { NextResponse } from "next/server";
import { nanoid } from 'nanoid';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phoneNum: true,
        homeAddress: true,
        birthDate: true,
        gender: true,
        registerNum: true,
        education: true,
        pastExperience: true,
        profileImage: true,
        createdDate: true,
        avgRating: true,
        isVerified: true
      }
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Generate client ID
    const clientId = `cli_${nanoid(21)}`;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Convert phone number to integer
    const phoneNum = parseInt(data.phoneNum.replace(/\D/g, ''), 10);
    if (isNaN(phoneNum)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }
    
    // Create the client with the generated ID and hashed password
    const client = await prisma.client.create({
      data: {
        id: clientId,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: hashedPassword,
        phoneNum: phoneNum,
        homeAddress: data.homeAddress,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        registerNum: data.registerNum,
        education: data.education || '',
        pastExperience: data.pastExperience || '',
        profileImage: data.imageURL || null,
        avgRating: 0,
        isVerified: false,
        createdDate: new Date()
      }
    });

    // Remove password from the response
    const { password, ...clientWithoutPassword } = client;
    
    return NextResponse.json(clientWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create client', details: error.message },
      { status: 500 }
    );
  }
} 