"use server";
import fs from "fs/promises";
import path from "path";

/**
 * Handles file upload and saves the file to the specified directory.
 * @param {File} file - The file to be uploaded.
 * @param {string} uploadDir - The directory where the file will be uploaded.
 * @param {string} newFilename - The new filename to be used for saving the file.
 * @returns {Promise<string>} - The file path of the uploaded file.
 */
export async function uploadFile(file, uploadDir, newFilename) {
  try {
    // Check if the directory exists; if not, create it
    try {
      await fs.access(uploadDir);
      console.log("Upload directory exists.");
    } catch (err) {
      // If the directory doesn't exist, create it
      await fs.mkdir(uploadDir, { recursive: true });
      console.log("Upload directory created.");
    }

    // Read the file content into a buffer
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // Generate the file path using the new filename
    const filePath = path.join(uploadDir, newFilename);

    // Write the file to the uploads directory using the new filename
    await fs.writeFile(filePath, bytes);

    // Return the file path
    console.log(filePath);
    return filePath;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
