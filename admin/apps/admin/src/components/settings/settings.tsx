import DashboardSettings from ".";
import PageMeta from "../../components/common/PageMeta";
import { HEADER_CONFIG } from "../../config/headerName";

const AccountSettingsModule: React.FC = () => {
  return (
    <>
      <PageMeta
        title={`Account Settings - ${HEADER_CONFIG.NAME}`}
        description="Account Settings - Weather Bot Admin."
      />
      <div className="space-y-6">
          <DashboardSettings/>
      </div>
    </>
  );
};

export default AccountSettingsModule;
