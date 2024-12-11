"use client";
import { useState, useEffect } from "react";

import UploadModal from "../modal/uploadmodal";
import { fetchFile } from "@/app/controller/fx_upload";
import PreviewModal from "../modal/previewmodal";
import { gettingPdf } from "../lib/getFile";

const Filelist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [PdfFiles, setPdfFiles] = useState([]); // create modal
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [filenamePass, setFilenamePass] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const closeModal3 = () => {
    setIsModalOpen3(false); // Close modal
  };

  const openModal3 = () => {
    setIsModalOpen3(true); // Open modal
  };

  const handlePassData = async (filename) => {
    setIsModalOpen2(true);
    console.log(filename);
    setFilenamePass(filename);
  };

  const getFileList = async () => {
    const result = await fetchFile();
    console.log(result);
    if (result.success) {
      setPdfFiles(result.data);
    } else {
      alert("There is an error on getting data");
    }
  };
  const handleDownload = async (fileName) => {
    try {
      const result = await gettingPdf(fileName); // Fetch the base64 data of the file
      if (result && result.base64Data) {
        const link = document.createElement("a");
        const blob = new Blob(
          [Uint8Array.from(atob(result.base64Data), (c) => c.charCodeAt(0))],
          { type: "application/pdf" }
        );
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = fileName; // Name of the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        URL.revokeObjectURL(url);
      } else {
        console.error("Failed to fetch file data");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => {
    getFileList();
  }, []);
  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-semibold mb-4">FILE LIST</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Files</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={openModal3}
          >
            Upload File
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
                  File description
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {PdfFiles.map((data, index) => (
                <tr
                  key={index}
                  className="odd:bg-gray-100 even:bg-gray-50 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{data.file_desc}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="text-blue-500 hover:underline mr-4 "
                      onClick={() => handlePassData(data.file_name)}
                    >
                      Previews
                    </button>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleDownload(data.file_name)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
      {/* PDF Preview Modal */}
      <PreviewModal
        show={isModalOpen2}
        onClose={() => setIsModalOpen2(false)}
        filename={filenamePass}
      />

      <UploadModal
        closeModal={closeModal3}
        show={isModalOpen3}
        onClose={() => setIsModalOpen3(false)}
        getFileList={getFileList}
      />
    </div>
  );
};

export default Filelist;
