"use client";
import { useUser } from "@/context/userContext";
import InnerSideBar from "../../_components/InnerSideBar";

export default function Layout({ children }: { children: any }) {
  const { user } = useUser();
  let links = [
    { name: "This Week", link: `/dashboard/${user.role}/weeklysales`, base: true },
    { name: "Report", link: `/dashboard/${user.role}/weeklysales/report` },
  ];
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Weakly Sales",
          links,
        }}
      />
    </>
  );
}
