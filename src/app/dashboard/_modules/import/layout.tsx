"use client";
import { useUser } from "@/context/userContext";
import InnerSideBar from "../../_components/InnerSideBar";

export default function Layout({ children }: { children: any }) {
  const { user } = useUser();
  let links = [
    {
      name: "import Data",
      link: `/dashboard/${user.role}/import`,
      base: false,
    },
    {
      name: "Add Import Data",
      link: `/dashboard/${user.role}/import/register`,
      base: false,
    },
  ];
  if (user.role == "admin") {
    links = [
      {
        name: "Report",
        link: `/dashboard/${user.role}/import/report`,
        base: true,
      },
      ...links,
    ];
  }
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Import",
          links: links,
        }}
      />
    </>
  );
}
