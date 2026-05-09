import { useEffect, useState } from "react";
import PageMeta from "../common/PageMeta";
import { HEADER_CONFIG } from "../../config/headerName";
import ModuleHeader from "../common/ModuleHeader";
import apiClient from "@/api/clients/apiClient";

type DashboardStats = {
  totalUsers: number;
  subscribedUsers: number;
  blockedUsers: number;
};

const DashboardModule: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    subscribedUsers: 0,
    blockedUsers: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await apiClient.get<any>("/api/users");
        const users = response.data ?? [];
        setStats({
          totalUsers: users.length,
          subscribedUsers: users.filter((user: any) => user.isSubscribed)
            .length,
          blockedUsers: users.filter((user: any) => user.isBlocked).length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <PageMeta
        title={`Dashboard - ${HEADER_CONFIG.NAME}`}
        description="Telegram Weather Bot Admin Dashboard"
      />
      <ModuleHeader pageTitle="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Subscribers
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.totalUsers}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Subscriptions
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.subscribedUsers}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Blocked Users
          </p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.blockedUsers}
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardModule;
