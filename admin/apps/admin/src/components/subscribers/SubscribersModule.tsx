import PageMeta from "../common/PageMeta";
import { HEADER_CONFIG } from "../../config/headerName";
import ModuleHeader from "../common/ModuleHeader";
import { useSearchParams } from "react-router-dom";
import SubscribersFilter from "./subscribersFilter/subscribersFilter";
import SubscribersTable from "./SubscribersTable";

const SubscribersModule: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const filters = {
    search: searchParams.get("search") || "",
  };

  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 when filtering
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  return (
    <>
      <PageMeta
        title={`Subscribers - ${HEADER_CONFIG.NAME}`}
        description="Manage Telegram Weather Bot subscribers."
      />
      <ModuleHeader
        pageTitle="Subscribers"
        is_reverse={true}
        isMultiLine={true}
        destination_path="subscribers"
        footerContent={
          <SubscribersFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        }
      />
      <div className="space-y-6">
        <SubscribersTable
          filters={filters}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          limit={limit}
        />
      </div>
    </>
  );
};

export default SubscribersModule;
