import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        // Convert phone number to integer
        const phoneNum = parseInt(data.phoneNum.toString().replace(/\D/g, ''), 10);
        if (isNaN(phoneNum)) {
            return NextResponse.json(
                { error: 'Invalid phone number format' },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            phoneNum: phoneNum,
            username: data.username,
            registerNum: data.registerNum,
            employeeRoleId: data.employeeRoleId
        };

        // If password is provided, hash it
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        // Update the employee
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

        // Remove password from response
        const { password, ...employeeWithoutPassword } = employee;

        return NextResponse.json(employeeWithoutPassword);
    } catch (error) {
        console.error('Error updating employee:', error);
        // Check for unique constraint violation
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