import React from "react";
import axios from "axios";
import { generateNewFileName } from "../lib/generateNewFileName";
import { uploadFile } from "../lib/uploadFile";

import path from "path";
import { updateFile } from "../lib/updateFile";

const submitUserInfo = async (
  fname,
  mname,
  lname,
  level,
  email,
  password,
  toUploadImg
) => {
  let filename = "";
  let file = toUploadImg.get("image");
  //function to rename file
  if (file) {
    const newFileName = generateNewFileName(file.name);
    filename = newFileName;
  }
  try {
    const submitInfo = await axios.post(
      "http://localhost:3000/api/user",
      {
        fname: fname,
        mname: mname,
        lname: lname,
        level: level,
        email: email,
        password: password,
        filename: filename,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = submitInfo.data;
    if (result.success) {
      console.log("User Inserted Successfully to pgadmin!");
    } else {
      console.log("Error inserting user to pgadmin");
    }
  } catch (error) {
    console.error(error.message);
    return { message: error.message };
  }
  //function to insert file to directory
  if (file) {
    const BASE_DIR = path.resolve(process.cwd(), "../RevSystem/reviewersys");
    const uploadDir = path.join(BASE_DIR, "upload/profileimg");

    const result = await uploadFile(file, uploadDir, filename);
    if (result) {
      console.log("File uploaded successfully to directory");
    } else {
      console.log("Error uploading to directory");
    }
  }
  return { success: true, message: "Success" };
};

const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/user", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = response.data;

    if (result.success) {
      return result.data;
    } else {
      return { code: "0000", message: "Error" };
    }
  } catch (error) {
    console.log(error.message);
    return { code: "0000", message: error.message };
  }
};

const updateUserStatus = async (userid, status) => {
  console.log(userid, status);
  try {
    const response = await axios.put(
      "http://localhost:3000/api/admin",
      { userid, status },
      { headers: { "Content-Type": "application/json" } }
    );

    const result = response.data;
    console.log(result);

    if (result.success) {
      return { success: true, message: "Update successfully!" };
    } else {
      return { success: false, message: "Error" };
    }
  } catch (error) {
    console.log(error.message);
    return { success: false, message: error.message };
  }
};

const updateUserData = async (updatedUserData) => {
  let filename = "";
  const file = updatedUserData.toUploadImg.get("image");
  const initialImageName = updatedUserData.initialimagename;

  // Check if there's a file to process
  if (file) {
    // Generate a new filename for the uploaded image
    filename = generateNewFileName(file.name);

    // Define the base directory and upload path
    const BASE_DIR = path.resolve(process.cwd(), "../RevSystem/reviewersys");
    const uploadDir = path.join(BASE_DIR, "upload/profileimg");

    // Attempt to upload the file to the specified directory
    try {
      const uploadResult = await updateFile(
        file,
        uploadDir,
        filename,
        initialImageName
      );
      if (uploadResult) {
        console.log("File uploaded successfully to directory");
      } else {
        console.log("Error uploading file to directory");
      }
    } catch (error) {
      console.error("Error during file upload:", error.message);
      return { success: false, message: "File upload failed" };
    }
  }

  // Prepare data for the API call
  const userUpdateData = {
    userid: updatedUserData.userid,
    fname: updatedUserData.fname,
    mname: updatedUserData.mname,
    lname: updatedUserData.lname,
    filename: filename,
    email: updatedUserData.email,
  };

  try {
    // Make the API request to update user data
    const response = await axios.put(
      "http://localhost:3000/api/user",
      userUpdateData,
      { headers: { "Content-Type": "application/json" } }
    );

    const result = response.data;

    if (result.success) {
      return { success: true, message: "Update successfully!" };
    } else {
      return { success: false, message: "Update failed" };
    }
  } catch (error) {
    // Handle errors from the API request
    console.error("Error updating user data:", error.message);
    return { success: false, message: error.message };
  }
};

const updateUserDataNoImg = async (updatedUserData) => {
  const userUpdateData = {
    userid: updatedUserData.userid,
    fname: updatedUserData.fname,
    mname: updatedUserData.mname,
    lname: updatedUserData.lname,
    email: updatedUserData.email,
    filename: updatedUserData.filename,
  };

  try {
    // Make the API request to update user data
    const response = await axios.put(
      "http://localhost:3000/api/user",
      userUpdateData,
      { headers: { "Content-Type": "application/json" } }
    );

    const result = response.data;

    if (result.success) {
      return { success: true, message: "Update successfully!" };
    } else {
      return { success: false, message: "Update failed" };
    }
  } catch (error) {
    // Handle errors from the API request
    console.error("Error updating user data:", error.message);
    return { success: false, message: error.message };
  }
};

export {
  submitUserInfo,
  fetchUsers,
  updateUserStatus,
  updateUserData,
  updateUserDataNoImg,
};
