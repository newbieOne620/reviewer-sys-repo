"use client";
import { useState, useRef } from "react";
import { submitPdf } from "../controller/fx_upload";

export default function UploadModal({ show, onClose, getFileList }) {
  const [fileDesc, setFileDesc] = useState("");
  const [file, setFile] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      if (uploadedFile.size > MAX_FILE_SIZE) {
        alert(
          "File size exceeds the 2 MB limit. Please upload a smaller file."
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
        setFile("");
      } else {
        setFile(uploadedFile);
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  const handleCancel = () => {
    onClose();
    setFile("");
    setFileDesc("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const toUplaodFile = new FormData();
    toUplaodFile.append("file", file);

    submitPdf(fileDesc, toUplaodFile)
      .then((response) => {
        if (response.success) {
          alert("File uploaded successfully"); // Show alert on success
          handleCancel();
          getFileList(); // Refresh the file list
        }
      })
      .catch((error) => {
        console.log(error.message);
        alert(`Error: ${error.message}`);
      });
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl mb-4 font-semibold">Upload PDF </h3>
        <form onSubmit={handleUpload}>
          {/* File Name */}
          <div className="mb-4">
            <label className="block text-gray-700">File description</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter file description"
              value={fileDesc}
              onChange={(e) => setFileDesc(e.target.value)}
              required
            />
          </div>
          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">Upload PDF</label>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              onChange={handleFileChange}
              required
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
