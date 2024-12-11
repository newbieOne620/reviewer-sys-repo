"use client";
import React, { useState, useEffect } from "react";

import { gettingProImg } from "../lib/getProimg";
import { updateUserStatus } from "../controller/fx_user";

function ViewUserModal({ show, onClose, userDataPass, getUsersData }) {
  const [status, setStatus] = useState("");
  const [initialStatus, setInitialStatus] = useState("");

  const [base64, setBase64] = useState(null);
  let filename = userDataPass.usr_img;

  const handleReset = async () => {
    onClose();

    getUsersData(); // Reset to the initial status
  };

  const handleUpdateStatus = async () => {
    let userid = userDataPass.usr_id;

    const result = await updateUserStatus(userid, status);
    console.log(result);
    if (!result.success) {
      alert(`Failed to update status: ${result.message}`);
    } else {
      alert("Status updated successfully");
      handleReset(); // Reset to the initial status
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

    // Update the status when userDataPass changes
    setStatus(userDataPass.usr_status);
    setInitialStatus(userDataPass.usr_status);

    // Call the profile image fetching function
    fetchProfileImage();
  }, [userDataPass, filename]); // Runs when `userDataPass` or `filename` changes

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
        <div className="flex items-center justify-between mb-4 ">
          <h3 className="text-2xl font-semibold">User Information</h3>
          <button
            className="text-xl font-bold text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Close"
            onClick={handleReset}
          >
            x
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-1/2 flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 font-semibold">
                  Name:
                </label>
                <p className="text-gray-900">
                  {`${userDataPass.usr_fname} ${userDataPass.usr_mname} ${userDataPass.usr_lname}`}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 font-semibold">
                  Email:
                </label>
                <p className="text-gray-900">{userDataPass.usr_email}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 font-semibold">
                  Level:
                </label>
                <p className="text-gray-900">
                  {userDataPass.usr_lvl === 1
                    ? "Admin"
                    : userDataPass.usr_lvl === 2
                    ? "Viewer"
                    : ""}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 font-semibold">
                  Status:
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                </select>
              </div>
            </div>
            <div className="w-1/2 flex flex-col   items-center justify-center">
              {base64 ? (
                <img
                  src={`data:image/png;base64,${base64}`} // Replace `image/png` with the correct MIME type if needed
                  className="w-80 h-80 rounded-full object-cover" // Adjust width and height as needed
                  alt="Image Preview"
                />
              ) : (
                <img
                  src="/noimage.jpg" // Replace with the actual name of your default image
                  className="w-80 h-80 rounded-full object-cover"
                  alt="Default Profile"
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
            {status !== initialStatus && ( // Only show the button if status has changed
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdateStatus}
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUserModal;
