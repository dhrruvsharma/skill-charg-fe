import Nav from "@/src/components/home/nav";
import Hero from "@/src/components/home/hero";
import Features from "@/src/components/home/features";
import Steps from "@/src/components/home/steps";
import Footer from "@/src/components/home/footer";

export default function Page() {
    return (
        <>
            <Nav />
            <Hero />
            <Features />
            <Steps />
            <Footer />
        </>
    )
}