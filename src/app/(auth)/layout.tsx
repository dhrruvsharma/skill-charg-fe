import Nav from "@/src/components/home/nav";

const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div>
            <Nav />
            {children}
        </div>
    )
}

export default AuthLayout;