"use client";
import Link from "next/link";
import Image from "next/image";
import { FaPeopleArrows } from "react-icons/fa";
import { LuImport } from "react-icons/lu";
import { MdOutlineInventory2 } from "react-icons/md";
import { usePathname } from "next/navigation";
import { FaPersonCircleCheck, FaCalendarWeek } from "react-icons/fa6";
import { PiMatrixLogoFill } from "react-icons/pi";
import { CiSettings } from "react-icons/ci";
import logo from "@/../public/assets/logo/icon.svg";
import { roleInf, useUser } from "@/context/userContext";
import { SiJfrogpipelines } from "react-icons/si";
import { LayoutDashboard } from "lucide-react";
interface MainLinkInf {
  name: string;
  Icon: any;
  link: string;
  mainLink?: string;
  exact?: boolean;
}

const adminLinks: MainLinkInf[] = [
  {
    name: "Dashboard",
    Icon: LayoutDashboard,
    link: "/dashboard/admin/",
    mainLink: "/dashboard/admin/",
    exact: true,
  },
  {
    name: "Import Data",
    Icon: LuImport,
    link: "/dashboard/admin/import/report",
    mainLink: "/dashboard/admin/import",
  },
  {
    name: "Inventory",
    Icon: MdOutlineInventory2,
    link: "/dashboard/admin/inventory",
  },

  {
    name: "CRM",
    Icon: FaPersonCircleCheck,
    link: "/dashboard/admin/crm",
  },

  {
    name: "Pipeline",
    Icon: SiJfrogpipelines,
    link: "/dashboard/admin/pipeline",
  },
  {
    name: "Cost Build Up",
    Icon: CiSettings,
    link: "/dashboard/admin/costbuildup",
  },
  {
    name: "Decision Matrix",
    Icon: PiMatrixLogoFill,
    link: "/dashboard/admin/iodm",
  },
  {
    name: "Weekly Sales",
    Icon: FaCalendarWeek, // Placeholder icon, replace with appropriate icon
    link: "/dashboard/admin/weeklysales",
  },
];
const sellsLinks: MainLinkInf[] = [
  {
    name: "Inventory",
    Icon: MdOutlineInventory2,
    link: "/dashboard/sales/inventory",
  },
  {
    name: "CRM",
    Icon: FaPersonCircleCheck,
    link: "/dashboard/sales/crm",
  },
  {
    name: "Weekly Sales",
    Icon: FaCalendarWeek, // Placeholder icon, replace with appropriate icon
    link: "/dashboard/sales/weeklysales",
  },
];
const aggregatorLinks: MainLinkInf[] = [
  {
    name: "Import Data",
    Icon: LuImport,
    link: "/dashboard/feeder/import",
  },
];

const sideLinks: any = {
  admin: adminLinks,
  sales: sellsLinks,
  feeder: aggregatorLinks,
  any: [],
};
const MainSideBar = () => {
  const { user } = useUser();
  const roles = new Set(["admin", "sales", "feeder"]);
  const role: any = roles.has(user.role) ? user.role : "any";
  return (
    <>
      {/* Desktop / Tablet sidebar */}
      <div className="hidden md:flex w-20 absolute left-0 top-0 group pb-6 hover:w-[240px] duration-300 border-r bg-[#f8f8f8] min-h-screen flex-col overflow-y-auto overflow-x-hidden z-[1001]">
        <div className="w-full h-12 min-h-12 max-h-12  flex">
          <div className="m-auto text-center  capitalize font-semibold  rounded-full p-1">
            <Image className="w-[25px]" src={logo} alt="Logo" />
          </div>
        </div>
        <div className="flex flex-col gap-3 px-2 pt-2  h-full flex-1">
          {sideLinks[role].map((link: MainLinkInf, key: number) => (
            <SideBarLink key={key} link={link} />
          ))}
        </div>
        {role == "admin" && <SettingSideBarLink />}
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-[#f8f8f8] z-[1001]">
        <div className="flex items-stretch gap-1 overflow-x-auto no-scrollbar px-1 py-1">
          {sideLinks[role].map((link: MainLinkInf, key: number) => (
            <MobileNavLink key={key} link={link} />
          ))}
          {role == "admin" && <MobileSettingsLink />}
        </div>
      </div>
    </>
  );
};

const SideBarLink = ({ link }: { link: MainLinkInf }) => {
  const Icon = link.Icon;
  const pathname = usePathname();
  const isActive =
    link.exact == true
      ? pathname == link.link.slice(0, link.link.length - 1)
      : pathname.includes(link.mainLink ? link.mainLink : link.link);

  return (
    <Link href={link.link} className=" ">
      <div
        className={`flex gap-1  items-center  py-1  rounded ${
          isActive
            ? "bg-primary text-white"
            : "hover:bg-primary/20 duration-100"
        } `}
      >
        <div className="min-w-[60px] py-2 px-1  flex ">
          <Icon
            className={`text-xl ${
              isActive ? "text-background" : "text-gray-900"
            }  mx-auto`}
          />
        </div>
        <div className="group-hover:flex hidden group-hover:min-w-fit  group-hover:flex-nowrap group-hover:overflow-hidden whitespace-nowrap text-clip">
          {link.name}
        </div>
      </div>
    </Link>
  );
};

const SettingSideBarLink = () => {
  const { user } = useUser();
  const link = {
    Icon: CiSettings,
    link: `/dashboard/${user.role}/settings`,
  };
  const Icon = link.Icon;
  const pathname = usePathname();
  const isActive = pathname.includes(link.link);

  return (
    <Link href={link.link} className="w-fit mt-auto px-2 pt-2">
      <div
        className={`flex gap-1  items-center  py-1 hover:bg-primary rounded  ${
          isActive ? "bg-primary text-white" : "hover:bg-primary/20"
        } `}
      >
        <div className="min-w-[60px] py-2 px-1  flex ">
          <Icon
            className={`text-xl  ${
              isActive ? "text-background" : "text-gray-900"
            } mx-auto`}
          />
        </div>
      </div>
    </Link>
  );
};

// Mobile specific links
const MobileNavLink = ({ link }: { link: MainLinkInf }) => {
  const Icon = link.Icon;
  const pathname = usePathname();
  const isActive =
    link.exact == true
      ? pathname == link.link.slice(0, link.link.length - 1)
      : pathname.includes(link.mainLink ? link.mainLink : link.link);

  return (
    <Link href={link.link} className="min-w-[84px] flex-1">
      <div
        className={`flex flex-col items-center justify-center px-4 py-2 rounded ${
          isActive ? "bg-primary text-white" : "hover:bg-primary/10"
        }`}
      >
        <Icon className={`text-3xl ${isActive ? "text-background" : "text-gray-900"}`} />
        <span className={`text-xs mt-1 max-md:hidden whitespace-nowrap ${isActive ? "text-background" : "text-gray-900"}`}>
          {link.name}
        </span>
      </div>
    </Link>
  );
};

const MobileSettingsLink = () => {
  const { user } = useUser();
  const link = {
    Icon: CiSettings,
    link: `/dashboard/${user.role}/settings`,
    name: "Settings",
  };
  return <MobileNavLink link={link as unknown as MainLinkInf} />;
};

export default MainSideBar;
