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
          className="h-10 w-full rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </div>
      {filters.search && (
        <button
          onClick={onClearFilters}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SubscribersFilter;
