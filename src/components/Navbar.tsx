import React from "react";
import { useAuth } from "../context/AuthContext";

interface NavProps {
  username: string;
}

const Navbar: React.FC<NavProps> = ({ username }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-800 p-4 w-screen">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Image Puzzle</div>
        <div className="flex items-center">
          <span className="text-white mr-4">{username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
