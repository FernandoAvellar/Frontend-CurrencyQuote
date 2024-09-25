"use client";
import { useState } from "react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [username, setUsername] = useState("");
  const [actualPassword, setActualPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleChangePassword = async (event) => {
    event.preventDefault();
    try {
      await api.put("/users/changepassword", {
        username: username,
        actualPassword: actualPassword,
        newPassword: newPassword,
      });
      router.push("/auth/login");
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error("Password change failed!");
    }
  };

  return (
    <main className="flex flex-grow items-center justify-center">
      <div className="bg-stone-100 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Change password</h2>
        <form onSubmit={handleChangePassword}>
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
            placeholder="Actual password"
            value={actualPassword}
            onChange={(e) => setActualPassword(e.target.value)}
            className="mb-4 p-2 w-full border"
            autoComplete="current-password"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4 p-2 w-full border"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded w-full"
          >
            Change password
          </button>
        </form>
      </div>
    </main>
  );
}
