import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoPersonSharp } from "react-icons/io5";
import AddSupplier from "./AddSupplier";
import Link from "next/link";
import { FaTruck } from "react-icons/fa";
import { useUser } from "@/context/userContext";
import { usePathname } from "next/navigation";

const SupplierMenu = () => {
  const { user } = useUser();

  const pathname = usePathname();
  const isActive = pathname == "/dashboard/" + user.role + "/suppliers";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div role="button" className={`flex gap-2 items-center px-2 rounded ${isActive && "text-primary"}`}>
          <FaTruck className="text-xl" />
          <div className="max-md:hidden">Suppliers</div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Supplier</h4>
            <p className="text-sm text-muted-foreground">
              Your Suppliers Here!
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/dashboard/${user.role}/suppliers`}>
              <Button variant={"outline"} className="w-full">
                See Suppliers
              </Button>
            </Link>
            <AddSupplier />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SupplierMenu;
