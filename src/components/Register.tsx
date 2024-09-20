import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(username, password)) {
      alert("Registration successful. Please login.");
      if (login(username, password)) {
        navigate("/puzzle");
      }
    } else {
      alert("Username already exists");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
    </form>
  );
};
