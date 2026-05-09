import Button from "@shared/common/components/ui/button/Button.tsx";

interface SubscribersFilterProps {
  filters: {
    search: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

const SubscribersFilter: React.FC<SubscribersFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-3">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Search by username, city, telegram id..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors bg-white text-black border-gray-300 placeholder-gray-400 focus:border-[#000000] focus:ring-[#000000]/20 dark:bg-black dark:text-white dark:border-gray-800 dark:placeholder-gray-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-700/20"
        />
      </div>
      {filters.search && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default SubscribersFilter;
