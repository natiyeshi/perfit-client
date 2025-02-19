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
  withCredit?: boolean | null;
  isFinalized?: boolean | null;
}

const FilterCard = ({
  setFilters,
  filter,
}: {
  setFilters: Function;
  filter: filterInf;
}) => {
  const setWithCredit = (value: boolean | null) => {
    setFilters((da: any) => ({ ...da, withCredit: value }));
  };

  const setIsFinalized = (value: boolean | null) => {
    setFilters((da: any) => ({ ...da, isFinalized: value }));
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
            <div>Credit</div>
            <div className="flex gap-2">
              <Button
                className="py-1"
                variant={filter.withCredit !== true ? "outline" : "default"}
                onClick={() => setWithCredit(true)}
              >
                With Credit
              </Button>
              <Button
                variant={filter.withCredit !== false ? "outline" : "default"}
                onClick={() => setWithCredit(false)}
              >
                Without Credit
              </Button>
              <Button
                variant={filter.withCredit !== null ? "outline" : "default"}
                onClick={() => setWithCredit(null)}
              >
                All
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>Finalized</div>
            <div className="flex gap-2">
              <Button
                className="py-1"
                variant={filter.isFinalized !== true ? "outline" : "default"}
                onClick={() => setIsFinalized(true)}
              >
                Finalized
              </Button>
              <Button
                variant={filter.isFinalized !== false ? "outline" : "default"}
                onClick={() => setIsFinalized(false)}
              >
                Not Finalized
              </Button>
              <Button
                variant={filter.isFinalized !== null ? "outline" : "default"}
                onClick={() => setIsFinalized(null)}
              >
                All
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterCard;
