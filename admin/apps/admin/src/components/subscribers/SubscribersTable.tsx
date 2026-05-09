import { useEffect, useMemo, useState } from "react";
import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import apiClient from "@/api/clients/apiClient";

type Subscriber = {
  tele_id: string;
  username: string;
  location: string;
  isBlocked: boolean;
  isSubscribed: boolean;
};

interface SubscribersTableProps {
  filters: {
    search: string;
  };
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
}

const SubscribersTable: React.FC<SubscribersTableProps> = ({
  filters,
  currentPage,
  setCurrentPage,
  limit,
}) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<Subscriber[]>("/api/users");
      setSubscribers(response.data ?? []);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleToggleBlock = async (teleId: string) => {
    try {
      await apiClient.put(`/api/users/block/${teleId}`);
      await loadSubscribers();
    } catch (error) {
      console.error("Failed to toggle block status", error);
    }
  };

  const filteredSubscribers = useMemo(() => {
    const normalized = filters.search.trim().toLowerCase();
    if (!normalized) {
      return subscribers;
    }

    return subscribers.filter((user) =>
      [user.username, user.location, user.tele_id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [subscribers, filters.search]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / limit);
  const paginatedData = filteredSubscribers.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const columns: Column<Subscriber>[] = [
    {
      header: "Username",
      accessor: (item) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {item.username || "-"}
        </span>
      ),
    },
    {
      header: "Telegram ID",
      accessor: (item) => item.tele_id,
    },
    {
      header: "Location",
      accessor: (item) => item.location || "-",
    },
    {
      header: "Subscribed",
      accessor: (item) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            item.isSubscribed
              ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {item.isSubscribed ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Blocked",
      accessor: (item) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            item.isBlocked
              ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {item.isBlocked ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Action",
      disableRowClick: true,
      accessor: (item) => (
        <button
          onClick={() => handleToggleBlock(item.tele_id)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            item.isBlocked
              ? "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-500/10"
              : "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-500/10"
          }`}
        >
          {item.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No subscribers found."
      currentPage={currentPage}
      limit={limit}
      pagination={
        totalPages > 1
          ? {
              totalPages,
              currentPage,
              onPageChange: setCurrentPage,
            }
          : undefined
      }
    />
  );
};

export default SubscribersTable;
