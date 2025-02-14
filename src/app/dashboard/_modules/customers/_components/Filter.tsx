import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaFilter } from "react-icons/fa";
import { useState } from "react";

export interface filterInf {
  name: string;
  category?: ("A" | "B" | "C")[] | null;
}

const FilterCard = ({
  setFilters,
  filter,
}: {
  setFilters: Function;
  filter: filterInf;
}) => {
  
  const [selectedCategories, setSelectedCategories] = useState<
    ("A" | "B" | "C")[]
  >(filter.category || []);

  const handleCategoryChange = (category: "A" | "B" | "C") => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const applyFilters = () => {
    setFilters((prev: any) => ({ ...prev, category: selectedCategories }));
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
            <div>Category</div>
            <div className="flex gap-2">
              {["A", "B", "C"].map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      selectedCategories
                        ? selectedCategories.includes(
                            category as "A" | "B" | "C"
                          )
                        : false
                    }
                    onChange={() =>
                      handleCategoryChange(category as "A" | "B" | "C")
                    }
                  />
                  {category}
                </label>
              ))}
            </div>
            <Button onClick={applyFilters}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterCard;
