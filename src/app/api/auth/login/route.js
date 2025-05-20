import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Имейл болон нууц үгээ бөглөнө үү.' },
        { status: 400 }
      );
    }

    // Get user from database using Prisma
    const user = await prisma.client.findFirst({
      where: { email }
    });
    console.log(user);


    if (!user) {
      return NextResponse.json(
        { error: 'Имейл буруу байна.' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Нууц үг буруу байна.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: 'client'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    console.log(userWithoutPassword);

    // Set HTTP-only cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: userWithoutPassword
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 