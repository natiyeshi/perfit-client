"use client";

import { FolderIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface CustomComponentProps {
  link: string;
  name: string;
  base?: boolean;
}

const CustomLink: React.FC<CustomComponentProps> = ({ link, name,base = false }) => {
  const pathname = usePathname();

  const isActive = base != null ? pathname == link : name == "data" ? pathname == link : pathname.includes(link);

  return (
    <Link
      href={link}
      className={`capitalize py-1 px-2  ${isActive ? "bg-primary text-white" : "hover:bg-primary/40"} rounded mx-2 duration-200`}
    >
      <span className="flex items-center">
      <i className="mr-2">
        <FolderIcon className="w-8" />
      </i>
      {name}
      </span>
    </Link>
  );
};

export default CustomLink;
