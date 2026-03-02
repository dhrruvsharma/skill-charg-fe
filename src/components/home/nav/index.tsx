import Link from "next/link";
import {Button} from "@/src/components/ui/button";
import {Separator} from "@/src/components/ui/separator";

const Nav = () => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <nav className="flex flex-row gap-2 justify-between items-center px-20 py-3">
                <div className="font-semibold text-xl">
                    SkillCharge
                </div>
                <div className="flex flex-row gap-x-10 items-center text-muted-foreground">
                    <Link href="#">
                        How it works
                    </Link>
                    <Link href="#">
                        Features
                    </Link>
                    <Link href="#">
                        Help Center
                    </Link>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Link href="/login">
                        <Button className="font-semibold text-xl">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="font-semibold text-xl" variant="outline">
                            SignUp
                        </Button>
                    </Link>
                </div>
            </nav>
            <Separator />
        </div>
    )
}

export default Nav;