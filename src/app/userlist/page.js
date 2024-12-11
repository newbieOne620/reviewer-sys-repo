"use client";
import React from "react";
import { useState, useEffect } from "react";
import CreateUserModal from "../modal/createuser";
import { fetchUsers } from "../controller/fx_user";
import ViewUserModal from "../modal/viewuser";
function Userlist() {
  const [usersData, setUsersData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [userDataPass, setUserDataPass] = useState([]);

  const openModal = () => {
    setIsModalOpen(true); // Open modal
  };
  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };
  const handlePassData = (userData) => {
    setUserDataPass(userData);
    setIsModalOpen2(true);
  };

  // const openModal2 = () => {
  //   setIsModalOpen2(true); // Open modal
  // };
  const closeModal2 = () => {
    setIsModalOpen2(false); // Close modal
  };

  const getUsersData = async () => {
    const result = await fetchUsers();
    console.log(result);
    if (result.code === "0000") {
      alert("There is an error on getting data");
    } else {
      setUsersData(result);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-semibold mb-4">USER LIST</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Users</h1>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={openModal}
          >
            Add User
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
                  Name
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((data, index) => (
                <tr
                  key={index}
                  className="odd:bg-gray-100 even:bg-gray-50 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">
                    {`${data.usr_fname} ${data.usr_mname} ${data.usr_lname}`}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {data.usr_status === "1"
                      ? "Active"
                      : data.usr_status === "2"
                      ? "Inactive"
                      : ""}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="text-blue-500 hover:underline mr-4"
                      onClick={() => {
                        handlePassData(data);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {/* Add more rows dynamically */}
            </tbody>
          </table>
        </div>
      </div>
      <CreateUserModal
        show={isModalOpen}
        closeModal={closeModal}
        onClose={() => setIsModalOpen(false)}
        getUsersData={getUsersData}
      />
      <ViewUserModal
        show={isModalOpen2}
        onClose={() => setIsModalOpen2(false)}
        closeModal={closeModal2}
        userDataPass={userDataPass}
        getUsersData={getUsersData}
      />
    </div>
  );
}

export default Userlist;
