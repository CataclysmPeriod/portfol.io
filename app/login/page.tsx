"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin/upload");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy text-white">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">portfol.io login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy border border-white/20 rounded p-3 focus:outline-none focus:border-cyan transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy border border-white/20 rounded p-3 focus:outline-none focus:border-cyan transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-navy font-bold py-3 rounded hover:bg-cyan transition-colors"
          >
            login
          </button>
        </form>

        <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-white underline decoration-dashed">
                ← back to home
            </Link>
        </div>
      </div>
    </div>
  );
}
