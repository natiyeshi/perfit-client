"use client";
import { useUser } from "@/context/userContext";
import InnerSideBar from "../../_components/InnerSideBar";

export default  function Layout({ children }: { children: any }) {
  const { user } = useUser();
  let links = [
    { name: "data", link: `/dashboard/${user.role}/pipeline` },
    { name: "register", link: `/dashboard/${user.role}/pipeline/register` },
  ];
  // if (user.role == "admin") {
  //   links = [
  //     {
  //       name: "Report",
  //       link: `/dashboard/${user.role}/pipeline/report`,
  //     },
  //     ...links,
  //   ];
  // }
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Pipeline",
          links: links,
        }}
      />
    </>
  );
}
