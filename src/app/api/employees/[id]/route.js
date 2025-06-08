import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const employee = await prisma.employee.findUnique({
            where: {
                id: id
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

        if (!employee) {
            return NextResponse.json(
                { error: 'Employee not found' },
                { status: 404 }
            );
        }

        const { password, ...employeeWithoutPassword } = employee;

        return NextResponse.json(employeeWithoutPassword);
    } catch (error) {
        console.error('Error fetching employee:', error);
        return NextResponse.json(
            { error: 'Failed to fetch employee' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        const phoneNum = parseInt(data.phoneNum.toString().replace(/\D/g, ''), 10);
        if (isNaN(phoneNum)) {
            return NextResponse.json(
                { error: 'Invalid phone number format' },
                { status: 400 }
            );
        }

        const updateData = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            phoneNum: phoneNum,
            username: data.username,
            registerNum: data.registerNum,
            employeeRoleId: data.employeeRoleId
        };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const employee = await prisma.employee.update({
            where: {
                id: id
            },
            data: updateData,
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

        return NextResponse.json(employeeWithoutPassword);
    } catch (error) {
        console.error('Error updating employee:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Email or username already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update employee' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.employee.delete({
            where: {
                id: id
            }
        });
        return NextResponse.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return NextResponse.json(
            { error: 'Failed to delete employee' },
            { status: 500 }
        );
    }
} 