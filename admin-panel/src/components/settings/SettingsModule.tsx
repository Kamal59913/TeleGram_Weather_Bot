import { useUserData } from "@/redux/hooks/useUserData";

const SettingsModule = () => {
  const { userData } = useUserData();

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Admin Settings</h1>
      <div className="rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Name</p>
        <p className="text-base font-medium">{userData?.name || "-"}</p>
      </div>
      <div className="rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Username</p>
        <p className="text-base font-medium">{userData?.username || "-"}</p>
      </div>
      <div className="rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Email</p>
        <p className="text-base font-medium">{userData?.email || "-"}</p>
      </div>
    </div>
  );
};

export default SettingsModule;
