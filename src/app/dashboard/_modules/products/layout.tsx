"use client"
import { useUser } from "@/context/userContext";
import InnerSideBar from "../../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  const { user } = useUser();
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Products",
          links: [
            { name: "data", link: `/dashboard/${user.role}/products` },
            { name: "Report", link: `/dashboard/${user.role}/products/report` },
          ],
        }}
      />
    </>
  );
}
