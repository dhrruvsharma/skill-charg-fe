import React, { Suspense } from "react";
import Sidebar from "@/src/components/dashboard/sidebar";
import {Spinner} from "@/src/components/ui/spinner";

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex flex-row gap-2 w-full max-h-[94dvh]">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-full w-full">
                        <Spinner />
                    </div>
                }
            >
                <div className="flex flex-row">
                    <Sidebar />
                </div>
                {children}
            </Suspense>
        </div>
    )
}

export default DashboardLayout