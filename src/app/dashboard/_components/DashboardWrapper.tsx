import { roleOptions, User } from "@/context/userContext";
import MainSideBar from "./MainSideBar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/../public/assets/logo/icon.svg";
import { handleLogout } from "@/lib/helper";
import { reload } from "./functions/helper";

const DashboardWrapper = ({
  user,
  role,
  children,
}: {
  user: User;
  children: any;
  role: string;
}) => {
  return user.role === role ? (
    <main className="w-full min-h-screen overflow-y-hidden  flex text-sm bg-background text-foreground ">
      <MainSideBar />
      <>{children}</>
    </main>
  ) : roleOptions.has(user.role) ? (
    <div className="w-full h-screen gap-5 flex flex-col justify-center items-center bg-gray-50 p-5">
      <Image src={logo} className="w-[100px] animate-bounce" alt="Logo" />
      <div className="max-w-xl text-center text-red-500 font-semibold">
        You don&apos;t have permission to view this page.
      </div>
      <div className="text-sm max-w-sm text-center text-gray-600 mt-2">
        If this issue continues, please reload the page or log out and log in
        again.
      </div>
      <div className="flex justify-center gap-5 mt-4">
        <Button
          onClick={reload}
          variant={"outline"}
          className="border-blue-500 text-blue-500 hover:bg-blue-100"
        >
          Reload
        </Button>
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </Button>
      </div>
    </div>
  ) : (
    <div className="w-full h-screen gap-5 flex flex-col justify-center items-center bg-gray-50 p-5">
      <Image src={logo} className="w-[100px] animate-bounce" alt="Logo" />
      <div className="max-w-xl text-center text-red-500 font-semibold">
        Invalid User.
      </div>
      <div className="text-sm max-w-sm text-center text-gray-600 mt-2">
        If this issue continues, please reload the page or log out and log in
        again.
      </div>
      <div className="flex justify-center gap-5 mt-4">
        <Button
          onClick={reload}
          variant={"outline"}
          className="border-blue-500 text-blue-500 hover:bg-blue-100"
        >
          Reload
        </Button>
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardWrapper;
