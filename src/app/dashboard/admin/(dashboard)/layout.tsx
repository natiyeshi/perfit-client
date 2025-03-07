"use client";
import { useUser } from "@/context/userContext";
import { RightNav } from "../../_components/InnerSideBar";

export default function Layout({ children }: { children: any }) {
  const { user } = useUser();
  return (
    <>
      <RightNav children={children} />
    </>
  );
}
