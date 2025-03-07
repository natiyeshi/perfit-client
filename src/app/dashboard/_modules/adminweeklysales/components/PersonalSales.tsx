"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import LastReportTable from "./LastReportTable";
import { IUser } from "@/types/IUser";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "next/navigation";

const PersonalSales = () => {
  const { id }: any = useParams();
  
  const [user, setUser] = useState<IUser | null>(null);

  const lastReportQuery = useQuery(
    "weekly-sales-salesperson",
    () => axios.get("/weekly-sales/salesperson/" + id),
    {
      onSuccess(data) {
        console.log(data.data, "Last Report Loaded");
      },
      onError(err) {
        toast.error("Unable to load last week report!");
      },
      cacheTime: 0,
    }
  );

  const userQuery = useQuery("usersss", () => axios.get("/users/" + id), {
    onSuccess(data) {
      console.log(data.data, "User Loaded");
      setUser(data.data?.result ?? null);
    },
    onError(err) {
      toast.error("Unable to load user data!");
    },
    cacheTime: 0,
  });

  return (
    <div className="flex flex-col">
      <div className="mt-4 mb-8 ps-4 flex">
        <Link href={"/dashboard/admin/weeklysales"} className="my-auto me-3">
          <Button className="rounded-full">
            <FaArrowLeft />
          </Button>
        </Link>
        <div>
          {userQuery.isLoading ? (
            <div>working...</div>
          ) : (
            userQuery.isSuccess &&
            user && (
              <div className="flex flex-col">
                <div className="capitalize text-2xl font-semibold">
                  {user.fullName}
                </div>
                <div className="text-sm">{user.email}</div>
              </div>
            )
          )}
        </div>
      </div>

      {lastReportQuery.isLoading ? (
        "Loading Last Report..."
      ) : lastReportQuery.data?.data?.result ? (
        <LastReportTable data={lastReportQuery.data.data.result} />
      ) : (
        "No LastReport Data Available"
      )}
    </div>
  );
};

export default PersonalSales;
