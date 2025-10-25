import React from "react";
import { useSearchParams } from "react-router-dom";

export default function CreateProfile() {
  const [params] = useSearchParams();
  const userId = params.get("_id");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Create Your Profile</h1>
      <p className="text-lg mb-2">Welcome! Your user ID: {userId}</p>
      <p className="text-gray-400">You can now complete your profile here.</p>
    </div>
  );
}
