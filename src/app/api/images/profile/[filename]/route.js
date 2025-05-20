import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { filename } = params;
        const filePath = path.join('C:\\Users\\kyok3\\Pictures\\Storage\\Profile', filename);

        if (!fs.existsSync(filePath)) {
            return new NextResponse('Image not found', { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const fileType = path.extname(filename).slice(1);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': `image/${fileType}`,
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return new NextResponse('Error serving image', { status: 500 });
    }
} 