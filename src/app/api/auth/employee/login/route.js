import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Get employee from database using Prisma
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

    // Skip password verification and proceed with login
    // Generate JWT token
    const token = jwt.sign(
      { 
        employeeId: employee.id, 
        username: employee.username,
        role: employee.role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from employee object
    const { password: _, ...employeeWithoutPassword } = employee;

    // Set HTTP-only cookie
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