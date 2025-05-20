import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const timestamp = Date.now();
        const originalName = file.name;
        const filename = `${timestamp}-${originalName}`;

        // Define the storage path
        const storagePath = path.join('C:', 'Users', 'kyok3', 'Pictures', 'Storage', 'Service', filename);

        // Save the file
        await writeFile(storagePath, buffer);

        // Return the relative path that will be used in the database
        const relativePath = `/storage/service/${filename}`;

        return NextResponse.json({ filepath: relativePath });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
} 