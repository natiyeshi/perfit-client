"use client";
import { useEffect } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios"; // Axios setup
import { roleMap, useUser } from "@/context/userContext"; // Custom hook to access context
import Loading from "@/components/custom/loading";
import { handleLogout, reload } from "./_components/functions/helper";
import { Button } from "@/components/ui/button";
import logo from "@/../public/assets/logo/icon.svg";
import Image from "next/image";

// Function to fetch user data
const fetchUserData = async () => {
  const response = await axios.get("/auth/verify");
  return response.data.result.user; // Adjust this depending on the response structure
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setUser } = useUser(); // Access the context function to set user data
  const { data, isLoading, isError, error } = useQuery("user", fetchUserData, {
    onSuccess: (user) => {
      console.log(user, "__ROLE__");
    },
    onError: (err) => {
      if ((err as any).status == 401) {
        console.log("Redirecting...");
        handleLogout();
      }
    },
    staleTime: 1000 * 60 * 10 * 2, // 20 minutes
  });

  useEffect(() => {
    if (data) {
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: roleMap[data.role],
      });
    }
  }, [data, setUser]);

  return isLoading ? (
    <div className="w-full h-screen flex">
      <Loading className="m-auto" />
    </div>
  ) : isError ? (
    <div className="w-full h-screen gap-5 flex flex-col justify-center items-center bg-gray-50 p-5">
      <Image src={logo} className="w-[100px] animate-bounce" alt="Logo" />
      <div className="max-w-xl text-center text-red-500 font-semibold">
        {(error as any).response?.data?.message ??
          (error as any).message ??
          "An error occurred."}
      </div>
      <div className="text-sm max-w-sm text-center text-gray-600 mt-2">
        If this issue continues, please reload the page or log out and log in
        again.
      </div>
      <div className="flex justify-center gap-5 mt-4">
        <Button
          onClick={reload}
          variant={"outline"}
          className="border-blue-500 text-blue-500 hover:bg-blue-100"
        >
          Reload
        </Button>
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </Button>
      </div>
    </div>
  ) : (
    <div className="">
      {/* Render your layout content */}
      {children}
    </div>
  );
}
