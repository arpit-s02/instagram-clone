import { v2 as cloudinary } from 'cloudinary';
import { API_KEY, API_SECRET, CLOUD_NAME } from '../../config.js';
import fs from "fs/promises";

// Configuration
cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: API_KEY, 
    api_secret: API_SECRET // Click 'View API Keys' above to copy your API secret
});

// Upload a file
const uploadToCloudinary = async (localFilePath) => {
    const uploadResult = await cloudinary.uploader.upload(
        localFilePath, 
        {
            folder: "posts",
            resource_type: "auto"
        }
    );

    await fs.unlink(localFilePath);

    return uploadResult;
}

export { uploadToCloudinary };