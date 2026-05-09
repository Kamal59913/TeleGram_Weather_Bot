import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  AccountSettings,
  BoltIcon,
  ChevronDownIcon,
  GroupIcon,
  HorizontaLDots,
  PieChartIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { queryClient } from "../utils/queryClient";
import { clearToken } from "../utils/getToken";
import { ToastService } from "../utils/toastService";
import { useUserData } from "../redux/hooks/useUserData";
import { useModalData } from "../redux/hooks/useModal";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  type?: string;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <PieChartIcon />,
    path: "/dashboard",
  },
  {
    name: "Subscribers",
    icon: <GroupIcon />,
    path: "/subscribers",
  },
  {
    name: "Weather Config",
    icon: <BoltIcon />,
    path: "/weather-config",
  },
  {
    name: "Settings",
    icon: <AccountSettings />,
    path: "/settings",
  },
];

const othersItems: NavItem[] = [];

interface AppSidebarProps {
  closeOnSelect?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ closeOnSelect = false }) => {
  const { isExpanded, isMobileOpen, isHovered, toggleMobileSidebar } =
    useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const handleItemClick = () => {
    if (closeOnSelect && isMobileOpen) {
      toggleMobileSidebar();
    }
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
    const { setAuthenticated, setUserData } = useUserData();
    const { open, close } = useModalData();

    const handleSignOut = async () => {
      handleItemClick();
      open("log-out", {
        title: "Are you sure want to logout?",
        action: () => {
          signOut();
          close();
        },
      });
    };

    const signOut = async () => {
      try {
        queryClient.clear();
        clearToken();
        setAuthenticated(false);
        setUserData(null);
        ToastService.success("Signed Out Successfully", "anyId");
      } catch (error) {
        console.error("Sign out error:", error);
        ToastService.error("Sign out failed", "errorId");
      }
    };
    return (
      <ul className="flex flex-col gap-4">
        {items.map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : nav.type === "function" ? (
              <button
                onClick={handleSignOut}
                className="menu-item group menu-item-inactive w-full text-left"
              >
                <span className="menu-item-icon-size menu-item-icon-inactive">
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  onClick={handleItemClick}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        onClick={handleItemClick}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-black dark:border-gray-800 text-black h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div
        className={`py-8 mt-[14px] flex ${
          !isExpanded ? "lg:justify-center" : "justify-center"
        }`}
      >
        <Link to="/">
          {isExpanded || isMobileOpen ? (
            <div className="flex items-center space-x-2">
              {/* <span className="text-black dark:text-gray-400"></span> */}
              <img
                className="dark:hidden h-14"
                src="/images/logo/logo.svg"
                alt="Logo"
              />
              <img
                className="hidden dark:block h-14"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
              />
            </div>
          ) : (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={48}
                height={48}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={32}
                height={32}
              />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
