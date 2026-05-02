import { useEffect, useMemo, useState } from "react";
import apiClient from "@/api/clients/apiClient";

type Subscriber = {
  tele_id: string;
  username: string;
  location: string;
  isBlocked: boolean;
  isSubscribed: boolean;
};

const SubscribersModule = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [query, setQuery] = useState("");

  const loadSubscribers = async () => {
    try {
      const response = await apiClient.get<Subscriber[]>("/api/users");
      setSubscribers(response.data ?? []);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleToggleBlock = async (teleId: string) => {
    await apiClient.put(`/api/users/block/${teleId}`);
    await loadSubscribers();
  };

  const filteredSubscribers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return subscribers;
    }

    return subscribers.filter((user) =>
      [user.username, user.location, user.tele_id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [subscribers, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Subscribers</h1>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by username, city, telegram id"
          className="h-10 w-full max-w-sm rounded-lg border border-gray-300 px-3 text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600">
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Telegram ID</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Subscribed</th>
              <th className="px-4 py-3">Blocked</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.tele_id}>
                <td className="px-4 py-3">{subscriber.username || "-"}</td>
                <td className="px-4 py-3">{subscriber.tele_id}</td>
                <td className="px-4 py-3">{subscriber.location || "-"}</td>
                <td className="px-4 py-3">
                  {subscriber.isSubscribed ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  {subscriber.isBlocked ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleBlock(subscriber.tele_id)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium"
                  >
                    {subscriber.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredSubscribers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscribersModule;
