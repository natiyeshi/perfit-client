"use client";
import { useUser } from "@/context/userContext";
import InnerSideBar from "../../_components/InnerSideBar";

export default function Layout({ children }: { children: any }) {
  const { user } = useUser();
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Cost Buildup",
          links: [
            { name: "data", link: `/dashboard/${user.role}/costbuildup` },
            { name: "register", link: `/dashboard/${user.role}/costbuildup/register` },
          ],
        }}
      />
    </>
  );
}
