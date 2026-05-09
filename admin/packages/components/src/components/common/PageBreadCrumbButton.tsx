import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbProps {
  pageTitle: string;
  destination_name?: string;
  destination_path?: string;
  is_reverse?: boolean;
  footerContent?: ReactNode;
  backButtonText?: string;
}

const PageBreadcrumbButton: React.FC<BreadcrumbProps> = ({

  backButtonText = "Back"
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="back-btn bg-white border btn-black primary-button-text font-medium gap-2 hover:bg-gray-50 inline-flex items-center px-3 py-2 rounded-lg text-sm text-white"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {backButtonText}
      </button>
    </div>
  );
};

export default PageBreadcrumbButton;