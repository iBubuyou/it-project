import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../lib/prisma'; // Adjust the import path to your prisma instance

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadImage = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join('C:\\itproject\\public\\uploads'); // Use your desired directory
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error parsing the files' });
        }

        const file = files.image; 
        const filePath = path.join(form.uploadDir, file.newFilename);

        try {
            // Move file to the target location
            fs.renameSync(file.filepath, filePath);

            // Store the file path in the database
            const fileUrl = `/uploads/${file.newFilename}`; // This will be used as the URL
            await prisma.vet_clinic.create({
                data: {
                    info: fileUrl, // Save file URL in the 'info' field
                },
            });

            return res.status(200).json({ message: 'File uploaded successfully', path: fileUrl });
        } catch (error) {
            return res.status(500).json({ error: 'Error saving file info to database' });
        }
    });
};

export default uploadImage;
