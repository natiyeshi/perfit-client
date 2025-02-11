"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/../public/assets/logo/icon.svg";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Image src={logo} alt="Logo" width={150} height={150} className="mb-8" />
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      {typeof window !== "undefined" && window.history.length > 1 ? (
        <button
          onClick={() => window.history.back()}
          className="text-blue-500 hover:underline text-lg"
        >
          Go back
        </button>
      ) : (
        <Link
          href="/dashboard"
          className="text-blue-500 hover:underline text-lg"
        >
          Go to Dashboard
        </Link>
      )}
    </div>
  );
};

export default NotFoundPage;
