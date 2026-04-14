import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
