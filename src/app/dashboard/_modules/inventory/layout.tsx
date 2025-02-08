"use client"
import { useUser } from "@/context/userContext";
import InnerSideBar from "../../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  const { user } = useUser();
  let links = [
    { name: "Stock", link: `/dashboard/${user.role}/inventory`, base : true },
    { name: "import history", link: `/dashboard/${user.role}/inventory/import` },
    { name: "Add Inventory", link: `/dashboard/${user.role}/inventory/register` },
    { name: "Report", link: `/dashboard/${user.role}/inventory/report` },
  ];  
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Inventory",
          links,
        }}
      />
    </>
  );
}
