"use client";
import { useUser } from "@/context/userContext";
import InnerSideBar from "../../_components/InnerSideBar";

export default function Layout({ children }: { children: any }) {
  const { user } = useUser();
  const adminLinks = [
    { name: "data", link: `/dashboard/${user.role}/crm` },
    { name: "sales persons", link: `/dashboard/${user.role}/crm/salespersons` },
  ];
  const salesLinks = [
    { name: "data", link: `/dashboard/${user.role}/crm` },
    { name: "register", link: `/dashboard/${user.role}/crm/register` },
  ];
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "CRM",
          links:
            user.role == "admin"
              ? adminLinks
              : user.role == "sales"
              ? salesLinks
              : [],
        }}
      />
    </>
  );
}
