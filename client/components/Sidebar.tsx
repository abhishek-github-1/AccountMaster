import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const Sidebar = () => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "SALES",
    "PURCHASE",
    "BANK",
  ]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Bookings", path: "/bookings" },
    {
      label: "SALES",
      group: true,
      items: [
        { label: "Sales Journal", path: "/sales-journal" },
        { label: "Customer", path: "/customer" },
        { label: "Invoices", path: "/invoices" },
      ],
    },
    {
      label: "PURCHASE",
      group: true,
      items: [
        { label: "Purchase Journal", path: "/purchase-journal" },
        { label: "Vendors", path: "/vendors" },
        { label: "Bills", path: "/bills" },
      ],
    },
    {
      label: "BANK",
      group: true,
      items: [
        { label: "Bank Transactions", path: "/bank-transactions" },
        { label: "Bank Reconciliation", path: "/bank-reconciliation" },
        { label: "Bank Accounts", path: "/bank-accounts" },
      ],
    },
    { label: "Payments", path: "/payments" },
    { label: "Receipts", path: "/receipts" },
    { label: "Chart of Accounts", path: "/chart-of-accounts" },
  ];

  return (
    <div className="h-screen bg-white border-r border-gray-200 flex flex-col w-64 overflow-y-auto">
      {/* Logo / Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded text-white flex items-center justify-center font-bold text-sm">
            DE
          </div>
          <div className="text-sm font-semibold text-gray-800">Dushyant Enterprises</div>
        </div>
        <div className="text-xs text-gray-500 font-medium">Company Manager</div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, idx) => {
          if ("group" in item && item.group) {
            const isExpanded = expandedGroups.includes(item.label);
            return (
              <div key={idx}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 hover:text-primary transition-colors uppercase tracking-wide"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>
                {isExpanded && (
                  <div className="ml-2 space-y-1">
                    {item.items?.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        to={subItem.path}
                        className={cn(
                          "block px-3 py-2 text-sm rounded transition-colors",
                          isActive(subItem.path)
                            ? "bg-primary text-white font-semibold"
                            : "text-gray-600 hover:text-primary"
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={idx}
              to={item.path}
              className={cn(
                "block px-3 py-2 rounded transition-colors font-medium",
                isActive(item.path)
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <div className="text-xs font-bold text-primary">AS</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">
              Abhishek Sharma
            </div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
};
