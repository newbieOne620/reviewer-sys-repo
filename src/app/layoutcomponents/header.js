"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { gettingProImg } from "../lib/getProimg";

import UpdateUserModal from "../modal/updateusermodal";

const Header = () => {
  const { data: session } = useSession(); // Get the session data
  const [base64, setBase64] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  console.log(session);
  // Fetch base64 image only once when the user image is available
  const getBase64Image = async (filename) => {
    try {
      const result = await gettingProImg(filename);
      setBase64(result.base64Data);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.userimg) {
      getBase64Image(session.user.userimg);
    }
  }, [session?.user?.userimg]);

  // Dummy user data for the modal (replace with actual data)
  const userData = {
    usr_id: session?.user?.id || null,
    usr_name: session?.user?.name || "",
    usr_fname: session?.user?.fname || "",
    usr_mname: session?.user?.mname || "",
    usr_lname: session?.user?.lname || "",
    usr_email: session?.user?.email || "",
    usr_lvl: session?.user?.userlevel || null,
    usr_img: session?.user?.userimg || null,
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when modal opens
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <header className="bg-gray-800 p-4 flex items-center justify-between mb-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Image
            src="/boologo.jpg" // Direct path to the image in the public folder
            alt="Book Logo"
            width={50}
            height={50}
          />
          <span className="text-white font-semibold">Reviewer</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <button className="bg-white text-purple-500 py-2 px-4 rounded hover:bg-purple-100">
              Dashboard
            </button>
          </Link>
          <Link href="/filelist">
            <button className="bg-white text-purple-500 py-2 px-4 rounded hover:bg-purple-100">
              Files
            </button>
          </Link>
          <Link href="/userlist">
            <button className="bg-white text-purple-500 py-2 px-4 rounded hover:bg-purple-100">
              Users
            </button>
          </Link>
          {session?.user?.name && (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-white font-medium">
                  {session.user.name}
                </span>
                {base64 ? (
                  <img
                    src={`data:image/png;base64,${base64}`} // Display base64 image
                    className="w-10 h-10 rounded-full object-cover"
                    alt="User Profile"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full" /> // Fallback in case base64 is not available
                )}
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 p-4 bg-white rounded shadow-md z-10">
                  <button
                    onClick={handleOpenModal}
                    className="block w-full text-left px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 rounded py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      {/* Modal Component */}

      <UpdateUserModal
        show={isModalOpen}
        onClose={handleCloseModal}
        userDataPass={userData}
      />
    </>
  );
};

export default Header;
