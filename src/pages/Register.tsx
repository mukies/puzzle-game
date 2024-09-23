import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username and Password is required.");
      return;
    }

    if (register(username, password)) {
      alert("Registration successful.");
      if (login(username, password)) {
        navigate("/");
      }
    } else {
      alert("Username already exists");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className=" flex justify-center items-center flex-col">
        <h1 className=" text-lg sm:text-3xl font-semibold text-white">
          Welcome to Image Puzzle Game
        </h1>
        <span className=" text-xl sm:text-4xl font-semibold text-white">
          Register
        </span>
      </div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full px-3 py-2 border rounded-md"
        autoComplete="off"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="off"
        className="w-full px-3 py-2 border rounded-md"
      />
      <button
        type="submit"
        className="w-full px-3 py-2 text-white bg-green-600 rounded-md"
      >
        Register
      </button>
      <span className=" text-white font-semibold">
        Already have an acount ?{" "}
        <Link to={"/login"} className=" text-blue-400">
          Login
        </Link>
      </span>
    </form>
  );
};
