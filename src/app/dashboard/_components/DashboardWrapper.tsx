import { roleOptions, User } from "@/context/userContext";
import MainSideBar from "./MainSideBar";

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
    <div>You don&apos;t have permission to view this page.</div>
  ) : (
    <div>
      Invalid user role {role}
      {user.role} .
    </div>
  );
};

export default DashboardWrapper;
