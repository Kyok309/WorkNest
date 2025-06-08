import { NextResponse } from "next/server";
import { nanoid } from 'nanoid';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                phoneNum: true,
                username: true,
                registerNum: true,
                employeeRoleId: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return NextResponse.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json(
            { error: 'Failed to fetch employees' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        
        const employeeId = `emp_${nanoid(21)}`;
        
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const phoneNum = parseInt(data.phoneNum.replace(/\D/g, ''), 10);
        if (isNaN(phoneNum)) {
            return NextResponse.json(
                { error: 'Invalid phone number format' },
                { status: 400 }
            );
        }
        
        const employee = await prisma.employee.create({
            data: {
                id: employeeId,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                password: hashedPassword,
                phoneNum: phoneNum,
                username: data.username,
                registerNum: data.registerNum,
                employeeRoleId: data.employeeRoleId
            },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        const { password, ...employeeWithoutPassword } = employee;
        
        return NextResponse.json(employeeWithoutPassword, { status: 201 });
    } catch (error) {
        console.error('Error creating employee:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Email or username already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create employee', details: error.message },
            { status: 500 }
        );
    }
} 