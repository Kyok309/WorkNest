import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
    try {
        const { categoryId } = params;

        await prisma.subCategory.deleteMany({
            where: {
                categoryId: categoryId
            }
        });

        const category = await prisma.category.delete({
            where: {
                id: categoryId
            },
            include: {
                subCategories: true
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category and its subcategories" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { categoryId } = params;
        const data = await request.json();

        const category = await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                name: data.name
            }
        });

        await prisma.subCategory.deleteMany({
            where: {
                categoryId: categoryId,
                NOT: {
                    id: {
                        in: data.subCategories
                            .filter(sub => sub.id)
                            .map(sub => sub.id)
                    }
                }
            }
        });

        const subCategoryPromises = data.subCategories.map(subCategory => {
            if (subCategory.id) {
                return prisma.subCategory.update({
                    where: { id: subCategory.id },
                    data: { name: subCategory.name }
                });
            } else {
                return prisma.subCategory.create({
                    data: {
                        name: subCategory.name,
                        categoryId: categoryId
                    }
                });
            }
        });

        await Promise.all(subCategoryPromises);

        const updatedCategory = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { subCategories: true }
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}