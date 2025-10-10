"use client";
import CompetitorMenu from "@/components/custom/competitor/CompetitorMenu";
import CustomerMenu from "@/components/custom/customer/CustomerMenu";
import CustomLink from "@/components/custom/CustomLink";
import ProductMenu from "@/components/custom/product/ProductMenu";
import SupplierMenu from "@/components/custom/supplier/SupplierMenu";
import Cookies from "js-cookie";
import { IoNotifications, IoSettingsOutline, IoMenu, IoClose } from "react-icons/io5";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { roleInf, useUser } from "@/context/userContext";
import { handleLogout } from "@/lib/helper";
import Notifications from "./Notifications";
import { FaUserCheck } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useState } from "react";
interface LinkInf {
  name: string;
  link: string;
  Icon?: any;
  base?: boolean;
}

export interface InnerSideBarInf {
  name: string;
  links: LinkInf[];
}

const InnerSideBar = ({
  children,
  data,
}: {
  children: any;
  data: InnerSideBarInf;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex  max-md:flex-col w-full">
      <div className={`${isOpen ? "" : "max-md:hidden"} min-w-[230px] z-100  max-md:absolute max-md:top-0 max-md:left-0 max-md:right-0 max-md:bottom-0 bg-white z-[1000]  md:ml-[80px] border-r`}>
        <div className="h-12 min-h-12 max-h-12 ps-4 text-foreground border-b capitalize text-lg flex justify-between">
          <div className="my-auto">{data.name}</div>
          <button
            aria-label="Close menu"
            className="p-2 hover:bg-muted rounded-md my-auto md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <IoClose className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-5 ps-4 ">
          {data.links.map((singleLink, ind) => (
            <CustomLink
              base={singleLink.base}
              key={ind}
              link={singleLink.link}
              name={singleLink.name}
              />
          ))}
        </div>
      </div>
      <RightNav children={children} setIsOpen={setIsOpen} />
    </div>
  );
};

export const RightNav = ({ children , setIsOpen}: { children: any, setIsOpen : Function }) => {
  return (
    <div
      id={"nav-s"}
      className={`w-full  max-h-screen max-md:absolute max-md:top-0 max-md:left-0 max-md:right-0 max-md:bottom-0   flex-1  overflow-x-hidden overflow-y-auto`}
    >
      <div className="w-full flex flex-col  h-full">
        <div className="flex w-full h-12 min-h-12 max-h-12 border-b">
          
          <div className="mx-auto flex gap-4 my-auto pe-4">
            <ProductMenu />
            <CustomerMenu />
            <SupplierMenu />
            <CompetitorMenu />
          </div>
          <div className="pe-4 flex gap-3 ">
            <Notifications />
            <Profile />
            <button
              aria-label="Open menu"
              onClick={() => setIsOpen(d => !d)}
              className="my-auto p-2 rounded-md hover:bg-muted md:hidden"
            >
              <IoMenu className="text-xl" />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useUser();
  return (
    <Popover>
      <PopoverTrigger className="my-auto  flex gap-2">
        <div className="flex flex-col max-md:hidden ">
          <div className="capitalize text-primary font-bold">
            {user.fullName}
          </div>
          <div className="ms-auto text-xs capitalize">{user.role}</div>
        </div>
        <div className="my-auto border rounded-full p-2">
          <FaRegUser className="text-xl " />
        </div>
        {/* <div className="bg-foreground w-8 h-8 rounded-full text-background font-black  flex "></div> */}
      </PopoverTrigger>
      <PopoverContent className="shadow shadow-gray-500 w-32 me-4">
        <div className="flex flex-col gap-2 ">
          <Button className="w-full flex gap-1 border-none" variant={"outline"}>
            <IoSettingsOutline className="text-lg" />
            <Link href="/dashboard/admin/settings">Settings</Link>
          </Button>
          <Button
            onClick={handleLogout}
            className="w-full flex gap-1 border-none "
            variant={"outline"}
          >
            <IoMdLogOut />
            <span>Logout</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InnerSideBar;
