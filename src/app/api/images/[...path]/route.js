import { NextResponse } from "next/server";
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { path: imagePath } = params;
        const fullPath = path.join('C:', 'Users', 'kyok3', 'Pictures', ...imagePath);

        const imageBuffer = await readFile(fullPath);
        
        // Determine content type based on file extension
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }[ext] || 'application/octet-stream';

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000'
            }
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return NextResponse.json(
            { error: 'Failed to serve image' },
            { status: 500 }
        );
    }
} 