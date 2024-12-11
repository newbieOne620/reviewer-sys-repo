"use client";
import React, { useState, useEffect } from "react";
import { gettingProImg } from "../lib/getProimg";
import { updateUserData, updateUserDataNoImg } from "../controller/fx_user";

function UpdateUserModal({ show, onClose, userDataPass }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [base64, setBase64] = useState(null);
  const [imageError, setImageError] = useState("");
  const [initialimagename, setInitialImageName] = useState("");
  const [newimagename, setNewImageName] = useState("");

  // State variables for editable fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userid, setUserId] = useState("");
  const [image, setImage] = useState(null);
  let filename = userDataPass.usr_img;

  const handleReset = () => {
    setIsEditing(false);
    onClose();
    setProfileImage(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (newimagename) {
      const toUploadImg = new FormData();
      toUploadImg.append("image", image);

      const updatedUserData = {
        fname: firstName,
        mname: middleName,
        lname: lastName,
        email: email,
        userid: userid,
        toUploadImg: toUploadImg,
        initialimagename: initialimagename,
        newimagename: newimagename,
      };

      const result = await updateUserData(updatedUserData);
      if (!result.success) {
        alert(`${result.message}`);
      } else {
        alert(`${result.message}`);
        handleReset();
      }
    } else {
      const updatedUserData = {
        fname: firstName,
        mname: middleName,
        lname: lastName,
        email: email,
        userid: userid,
        filename: initialimagename,
      };
      const result = await updateUserDataNoImg(updatedUserData);
      if (!result.success) {
        alert(`${result.message}`);
      } else {
        alert(`${result.message}`);
        handleReset();
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Display the uploaded image
      setImage(file);
      setImageError(""); // Clear the error message
      setNewImageName(file.name);
    }
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (filename) {
        try {
          const result = await gettingProImg(filename);
          setBase64(result.base64Data);
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };

    // Populate fields when modal opens
    if (userDataPass) {
      setFirstName(userDataPass.usr_fname);
      setMiddleName(userDataPass.usr_mname);
      setLastName(userDataPass.usr_lname);
      setEmail(userDataPass.usr_email);
      setUserId(userDataPass.usr_id);
      setInitialImageName(userDataPass.usr_img);
    }

    fetchProfileImage();
  }, [userDataPass, filename]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleReset}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-black">
            User Information
          </h3>
          <button
            className="text-xl font-bold text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Close"
            onClick={handleReset}
          >
            x
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleUpdateStatus}>
          <div className="flex gap-4">
            <div className="w-1/2 flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 font-semibold">
                  First name:
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border ${
                    isEditing
                      ? "border-blue-300"
                      : "border-gray-300 bg-gray-100"
                  } rounded-md text-black focus:outline-none`}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 font-semibold">
                  Middle name:
                </label>
                <input
                  required
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border ${
                    isEditing
                      ? "border-blue-300"
                      : "border-gray-300 bg-gray-100"
                  } rounded-md text-black focus:outline-none`}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 font-semibold">
                  Last name:
                </label>
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border ${
                    isEditing
                      ? "border-blue-300"
                      : "border-gray-300 bg-gray-100"
                  } rounded-md text-black focus:outline-none`}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 font-semibold">
                  Email:
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border ${
                    isEditing
                      ? "border-blue-300"
                      : "border-gray-300 bg-gray-100"
                  } rounded-md text-black focus:outline-none`}
                />
              </div>
            </div>
            <div
              className={`w-1/2 flex p-4 flex-col items-center justify-center ${
                isEditing ? "border border-dashed border-gray-300" : ""
              }`}
            >
              {profileImage || base64 ? (
                <img
                  src={profileImage || `data:image/png;base64,${base64}`}
                  className="w-80 h-80 rounded-full object-cover"
                  alt="Image Preview"
                />
              ) : (
                <img
                  src="/noimage.jpg" // Replace with the actual name of your default image
                  className="w-80 h-80 rounded-full object-cover"
                  alt="Default Profile"
                />
              )}
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="bg-blue-500 text-white px-4 py-2 mt-4 rounded cursor-pointer hover:bg-blue-700"
                  >
                    Choose File
                  </label>
                  {imageError && (
                    <p className="text-red-500 text-sm mt-2">{imageError}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {isEditing && (
              <>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={handleReset}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
        {!isEditing && (
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateUserModal;
