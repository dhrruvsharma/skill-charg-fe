import React from "react";
import {Navbar} from "@/src/components/nav";

const UserLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default UserLayout;