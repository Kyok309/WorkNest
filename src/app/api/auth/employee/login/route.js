import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findFirst({
      where: { username, password },
      include: {
        role: true
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Нэвтрэх нэр эсвэл нууц үг буруу байна.' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { 
        employeeId: employee.id, 
        username: employee.username,
        role: employee.role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: _, ...employeeWithoutPassword } = employee;

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        employee: employeeWithoutPassword
      },
      { status: 200 }
    );

    response.cookies.set('employee_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400
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