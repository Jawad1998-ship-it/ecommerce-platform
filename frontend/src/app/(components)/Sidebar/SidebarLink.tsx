import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

export const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer border-b border-b-gray-300 flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        } gap-3 transition-colors duration-200 ${
          theme === "dark"
            ? `${
                isActive
                  ? "text-white bg-blue-600" // Active state in dark mode
                  : "text-white hover:text-white hover:bg-blue-400" // Hover state in dark mode (unchanged)
              }`
            : `${
                isActive
                  ? "text-gray-900 bg-blue-200" // Active state in light mode
                  : "text-black hover:text-gray-800 hover:bg-blue-100" // Updated hover state in light mode
              }`
        }`}
      >
        <Icon
          className={`w-6 h-6 ${
            theme === "dark"
              ? isActive
                ? "text-white"
                : "text-inherit"
              : isActive
              ? "text-gray-900"
              : "text-inherit" // Inherits hover:text-gray-800 during hover
          }`}
        />
        <span
          className={`${isCollapsed ? "hidden" : "block"} font-medium ${
            theme === "dark"
              ? isActive
                ? "text-white"
                : "text-inherit"
              : isActive
              ? "text-gray-900"
              : "text-inherit" // Inherits hover:text-gray-800 during hover
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};
