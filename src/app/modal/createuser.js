import { useState } from "react";
import { submitUserInfo } from "../controller/fx_user";
import bcrypt from "bcryptjs";

function CreateUserModal({ show, onClose, getUsersData }) {
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [level, setLevel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Display the uploaded image
      setImage(file);
      setImageError(""); // Clear the error message
    }
  };

  const handleReset = () => {
    getUsersData();

    setImageError("");
    setFname("");
    setMname("");
    setLname("");
    setLevel("");
    setEmail("");
    setPassword("");
    setProfileImage(null);
    setImage(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setImageError("Please upload an image.");
      return;
    }

    const toUploadImg = new FormData();
    toUploadImg.append("image", image);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await submitUserInfo(
      fname,
      mname,
      lname,
      level,
      email,
      hashedPassword,
      toUploadImg
    );

    if (result.success) {
      handleReset();
    } else {
      console.log("User Inserting failed");
    }
  };

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
        className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold mb-4">User Information</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Left side inputs */}
          <div className="flex gap-4">
            <div className="w-1/3 flex flex-col gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="text-gray-700 font-medium mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={fname}
                  name="firstName"
                  placeholder="Enter first name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  onChange={(e) => setFname(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="middleName"
                  className="text-gray-700 font-medium mb-1"
                >
                  Middle Name
                </label>
                <input
                  id="middleName"
                  type="text"
                  name="middleName"
                  value={mname}
                  placeholder="Enter middle name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  onChange={(e) => setMname(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="text-gray-700 font-medium mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={lname}
                  placeholder="Enter last name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  onChange={(e) => setLname(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-gray-700 font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="level"
                  className="text-gray-700 font-medium mb-1"
                >
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  onChange={(e) => setLevel(e.target.value)}
                  value={level}
                  required
                >
                  <option value="">Select level</option>
                  <option value="1">Admin</option>
                  <option value="2">Viewer</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-gray-700 font-medium mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* Image upload area */}
            <div className="w-2/3 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-4 ">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Uploaded"
                  className="w-full h-64 mb-4 object-contain rounded-md"
                />
              ) : (
                <div className="text-gray-400 text-center mb-4">
                  <span className="text-6xl">+</span>
                  <p>Upload Image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
              >
                Choose File
              </label>
              {imageError && (
                <p className="text-red-500 text-sm mt-2">{imageError}</p>
              )}
            </div>
          </div>
          {/* Footer buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserModal;
