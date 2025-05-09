import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaFilter } from "react-icons/fa";
export interface filterInf {
  name: string;
  isArrived?: string | null;
}

const FilterCard = ({
  setFilters,
  filter,
}: {
  setFilters: Function;
  filter: filterInf;
}) => {
  const setArrived = (value: string | null) => {
    setFilters((da: any) => ({ ...da, isArrived: value }));
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FaFilter className="" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set Your Filters Here.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div>Is Arrived</div>
            <div className="flex gap-2">
              <Button
                className="py-1"
                variant={filter.isArrived == "arrived" ? "default" : "outline"}
                onClick={() => setArrived("arrived")}
              >
                Arrived
              </Button>
              <Button
                variant={filter.isArrived == "not arrived" ? "default" : "outline"}
                onClick={() => setArrived("not arrived")}
              >
                On The Way
              </Button>
              <Button
                variant={filter.isArrived == null ? "default" : "outline"}
                onClick={() => setArrived(null)}
              >
                Both
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterCard;
