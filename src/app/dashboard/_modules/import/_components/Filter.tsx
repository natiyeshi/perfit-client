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
  date: string | null;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterCard = ({
  setFilters,
  filter,
}: {
  setFilters: Function;
  filter: filterInf;
}) => {
  const setGender = (value: string | null) => {
    setFilters((da: any) => ({ ...da, gender: value }));
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

          <Select
            value={filter.date ?? ""}
            onValueChange={(value: string) =>
              setFilters({
                ...filter,
                date: value as any,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="last month">Last Month</SelectItem>
              <SelectItem value="last 3 months">Last 3 Months</SelectItem>
              <SelectItem value="last 6 months">Last 6 Months</SelectItem>
              <SelectItem value="this 12 months">This 12 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterCard;
