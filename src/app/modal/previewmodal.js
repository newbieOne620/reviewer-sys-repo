"use client";

import { useEffect, useState } from "react";

import { gettingPdf } from "../lib/getFile";

export default function PreviewModal({ show, onClose, filename }) {
  const [base64, setBase64] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      if (filename) {
        try {
          const result = await gettingPdf(filename);
          setBase64(result.base64Data);
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      }
    };

    fetchPdf();
  }, [filename, show]);

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
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-[90vh] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold"
        >
          &times;
        </button>
        <h3 className="text-2xl mb-4 font-semibold">PDF Preview</h3>
        <div className="border rounded overflow-auto h-full">
          {base64 ? (
            <iframe
              src={`data:application/pdf;base64,${base64}`}
              className="w-full h-full"
              style={{ minHeight: "100%" }}
              title="PDF Preview"
            />
          ) : (
            <img
              src="/noimage.jpg" // Replace with the path to your image in the public folder
              alt="Default Preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
