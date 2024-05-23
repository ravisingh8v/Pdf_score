import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export async function uploadOnCloudinary(localFilePath: any) {
  try {
    if (!localFilePath) return;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "job-board",
    });
    console.log("File Uploaded Successfully on Cloudinary", response.url);
    return response;
  } catch (error) {
    // remove the local file if operation failed
    fs.unlinkSync(localFilePath);
    console.log(error);
    return null;
  }
}
export async function deleteFromCloudinary(publicId: any) {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    return null;
  }
}
