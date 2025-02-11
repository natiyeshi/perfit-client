"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user && user.role) {
      router.push("/dashboard/" + user.role);
    }
  }, [user, router]);

  return <>Redirecting....</>;
}
