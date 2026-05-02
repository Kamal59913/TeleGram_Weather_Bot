import { useEffect, useState } from "react";
import apiClient from "@/api/clients/apiClient";

type DashboardStats = {
  totalUsers: number;
  subscribedUsers: number;
  blockedUsers: number;
};

const DashboardModule = () => {
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
          subscribedUsers: users.filter((user: any) => user.isSubscribed).length,
          blockedUsers: users.filter((user: any) => user.isBlocked).length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Telegram Weather Bot Admin</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Subscribers</p>
          <p className="mt-2 text-3xl font-semibold">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Active Subscriptions</p>
          <p className="mt-2 text-3xl font-semibold">{stats.subscribedUsers}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Blocked Users</p>
          <p className="mt-2 text-3xl font-semibold">{stats.blockedUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
