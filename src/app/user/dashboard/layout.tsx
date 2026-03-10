import React from "react";
import Sidebar from "@/src/components/dashboard/sidebar";

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex flex-row gap-2 w-full h-full">
            <div className="flex flex-row">
                <Sidebar />
            </div>
            {children}
        </div>
    )
}

export default DashboardLayout