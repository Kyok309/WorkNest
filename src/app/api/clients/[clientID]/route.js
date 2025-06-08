import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const clientId = await params.clientID;

    try {
        const client = await prisma.client.findUnique({
            where: {
                id: clientId
            },
            include: {
                services: true,
                ads: true,
                comments: true
            }
        });

        if (!client) {
            return NextResponse.json(
                { error: "Хэрэглэгч олдсонгүй." },
                { status: 404 }
            );
        }

        const { password, ...clientWithoutPassword } = client;

        return NextResponse.json(clientWithoutPassword);
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json(
            { error: "Хэрэглэгчийн мэдээлэл ачаалахад алдаа гарлаа." },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { clientID } = params;
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        
        const profileImage = formData.get('profileImage');
        let imagePath = null;
        
        if (profileImage && profileImage.size > 0) {
            const storagePath = 'C:\\Users\\kyok3\\Pictures\\Storage\\Profile';
            const fileName = `${clientID}-${Date.now()}.${profileImage.name.split('.').pop()}`;
            const fullPath = path.join(storagePath, fileName);
            
            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true });
            }
            
            const bytes = await profileImage.arrayBuffer();
            const buffer = Buffer.from(bytes);
            fs.writeFileSync(fullPath, buffer);
            
            imagePath = `/api/images/profile/${fileName}`;
        }

        const updatedClient = await prisma.client.update({
            where: {
                id: clientID
            },
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                education: data.education,
                email: data.email,
                pastExperience: data.pastExperience,
                phoneNum: parseInt(data.phoneNum.replace(/\D/g, '')),
                homeAddress: data.homeAddress,
                birthDate: new Date(data.birthDate),
                gender: data.gender,
                ...(imagePath && { profileImage: imagePath })
            },
            include: {
                services: true,
                ads: true,
                comments: true
            }
        });

        const { password, ...clientWithoutPassword } = updatedClient;

        return NextResponse.json({ success: true, data: clientWithoutPassword });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
