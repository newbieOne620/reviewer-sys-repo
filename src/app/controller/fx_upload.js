import axios from "axios";
import path from "path";
import { uploadFile } from "../lib/uploadFile";
import { generateNewFileName } from "../lib/generateNewFileName";

const submitPdf = async (fileDesc, toUplaodFile) => {
  const attachmentFile = toUplaodFile.get("file");

  let filename = "";

  const file = attachmentFile;

  // Function to rename file
  if (file) {
    let newFileName = generateNewFileName(file.name);
    filename = newFileName;

    //upload filename to pgadmin
    try {
      const submitFilename = await axios.post(
        "http://localhost:3000/api/upload",
        {
          filedesc: fileDesc,
          filename: filename,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = submitFilename.data;
      if (result.success) {
        console.log("filename uploaded to pgadmin");
      } else {
        console.log("filename error uploading to pgadmin");
      }
    } catch (error) {
      console.log(error.message);
      return { code: "0000", message: error.message };
    }
  }
  // Funtion to upload file
  if (file) {
    const BASE_DIR = path.resolve(process.cwd(), "../RevSystem/reviewersys");
    const uploadDir = path.join(BASE_DIR, "upload/lyndon");

    const result = await uploadFile(file, uploadDir, filename);

    if (result) {
      console.log("File uploaded successfully to directory");
    } else {
      console.log("Error uploading to directory");
    }
  }

  return { success: true, message: "Success" };
};

const fetchFile = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/upload", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    const result = response.data;
    console.log(result);
    if (result.success) {
      return result; // Return the result object directly
    } else {
      return { code: "0000", message: "Error" };
    }
  } catch (error) {
    console.log(error.message);
    return { code: "0000", message: error.message };
  }
};

export { submitPdf, fetchFile };
