"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/api/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        username: username,
        password: password,
      });
      login(response.data.accessToken, response.data.refreshToken, {
        username,
      });
      toast.success("Logged in successfully!");
      router.push("/home");
    } catch (error) {
      toast.error("Login failed. Verify username/password");
    }
  };

  function handleChangePassword() {
    router.push("/auth/changepassword");
  }

  return (
    <main className="flex flex-grow items-center justify-center">
      <div className="bg-stone-100 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 p-2 w-full border"
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 w-full border"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full mb-2"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleChangePassword}
          className="bg-purple-500 text-white px-4 py-2 rounded w-full"
        >
          Change password
        </button>
      </div>
    </main>
  );
}
