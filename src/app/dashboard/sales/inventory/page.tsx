import { redirect } from "next/navigation";
import InventoryTable from "./_components/InventoryTable";

const Page = () => {
  // redirect("/dashboard/admin/hr/employees");
  return (
    <>
      <InventoryTable />
    </>
  );
};

export default Page;
