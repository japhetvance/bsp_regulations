"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from "lucide-react";
import type { PolicyStatus } from "@/types/policy";

interface FilterControlsProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: PolicyStatus | "all";
  onStatusFilterChange: (value: PolicyStatus | "all") => void;
  onReset: () => void;
}

export function FilterControls({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search policies, references, or proof"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-sm text-neutral-500">
          <Filter className="h-4 w-4" /> Filters
        </span>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as PolicyStatus | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Fully Compliant">Fully Compliant</SelectItem>
            <SelectItem value="Slightly Compliant">Partial Compliance</SelectItem>
            <SelectItem value="Non-Existent">NA - Information Only</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" type="button" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
}

