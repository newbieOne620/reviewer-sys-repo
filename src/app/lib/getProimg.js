"use server";
import path from "path";
import fs from "fs/promises";

export async function gettingProImg(filename) {
  try {
    const filePath = path.join(process.cwd(), "upload/profileimg", filename);

    // Check if the file exists
    try {
      await fs.access(filePath);
    } catch {
      console.error("File not found:", filename);
      return { error: "File not found" };
    }

    // Read the file contents asynchronously
    const fileBuffer = await fs.readFile(filePath);

    // Convert buffer to Base64 string
    const base64Data = fileBuffer.toString("base64");

    // Return the Base64 data
    return { success: true, base64Data };
  } catch (error) {
    console.error("Error reading file:", error);
    return { error: "Error reading file" };
  }
}
