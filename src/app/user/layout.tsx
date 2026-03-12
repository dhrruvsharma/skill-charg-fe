import React from "react";
import {Navbar} from "@/src/components/nav";

const UserLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex flex-col gap-2">
            <Navbar />
            {children}
        </div>
    )
}

export default UserLayout;