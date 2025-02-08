"use client"
import { useUser } from "@/context/userContext";
import InnerSideBar from "../../_components/InnerSideBar";

export default function Layout({ children }: { children: any }) {
  const { user } = useUser();
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "customers",
          links: [
            { name: "data", link: `/dashboard/${user.role}/customers` },
            { name: "Report", link: `/dashboard/${user.role}/customers/report` },
          ],
        }}
      />
    </>
  );
}
