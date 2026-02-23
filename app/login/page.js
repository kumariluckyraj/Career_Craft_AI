"use client";

import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const providers = [
    { name: "Google", id: "google" },
    
   
   
    { name: "GitHub", id: "github" },
    
  ];

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">
      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome 
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Login to unlock your AI career tools
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-black font-medium 
              hover:bg-gray-200 transition-all duration-200 shadow-md"
            >
              Continue with {provider.name}
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-xs text-center mt-6">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;