import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Username and Password is required.");
      return;
    }
    if (login(username, password)) {
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className=" flex justify-center items-center flex-col">
        <h1 className=" text-lg sm:text-3xl font-semibold text-white">
          Welcome to Image Puzzle Game
        </h1>
        <span className=" text-xl sm:text-4xl font-semibold text-white">
          Login
        </span>
      </div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full px-3 py-2 border rounded-md"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-3 py-2 border rounded-md"
      />
      <button
        type="submit"
        className="w-full px-3 py-2 text-white bg-blue-600 rounded-md"
      >
        Login
      </button>
      <span className=" text-white font-semibold">
        Didn't have an acount ?{" "}
        <Link to={"/signup"} className=" text-blue-400">
          Register
        </Link>
      </span>
    </form>
  );
};
