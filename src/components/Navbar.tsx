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
    <nav className="bg-gray-800 sticky top-0 z-10 left-0 right-0 h-[80px] p-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Image Puzzle</div>
        <div className="flex items-center gap-2">
          <span className="text-white md:mr-4">{username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white sm:font-bold px-1 py-1 font-semibold sm:py-2 sm:px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
