"use server";
import fs from "fs/promises";
import path from "path";

/**
 * Replaces an existing file with a new file in the specified directory.
 * @param {File} newFile - The new file to be uploaded.
 * @param {string} uploadDir - The directory where the file will be uploaded.
 * @param {string} oldFilename - The name of the existing file to be replaced.
 * @param {string} newFilename - The new filename to use for the replacement.
 * @returns {Promise<string>} - The file path of the newly uploaded file.
 */
export async function updateFile(newFile, uploadDir, newFilename, oldFilename) {
  try {
    // Generate the full path of the old file
    const oldFilePath = path.join(uploadDir, oldFilename);

    // Check if the old file exists
    try {
      await fs.access(oldFilePath);
      console.log(`Old file found: ${oldFilePath}`);

      // Delete the old file
      await fs.unlink(oldFilePath);
      console.log(`Old file deleted: ${oldFilePath}`);
    } catch (err) {
      console.log(`Old file not found: ${oldFilePath}`);
    }

    // Read the new file content into a buffer
    const buffer = await newFile.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // Generate the file path using the new filename
    const newFilePath = path.join(uploadDir, newFilename);

    // Write the new file to the directory
    await fs.writeFile(newFilePath, bytes);
    console.log(`New file uploaded: ${newFilePath}`);

    // Return the file path of the newly uploaded file
    return newFilePath;
  } catch (error) {
    console.error("Error replacing file:", error);
    throw error;
  }
}
