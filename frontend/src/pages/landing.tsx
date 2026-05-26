import { Hero7 } from "@/components/hero";
import Navbar from "@/components/navbar";

export function Landing() {
    return (
        <>
            <Navbar />
            <Hero7
                badge={{
                    label: "New Release",
                    variant: "outline"
                }}
                heading="Create stunning youtube thumbnail"
                description="Turn ideas into beautiful, professional sites using our intuitive no-code platform, where anyone can easily drag, drop, and customize templates to bring creative visions to life without coding."
                buttons={
                    [
                        { label: "Get Started", href: "/generate", variant: "default" },
                        { label: "Watch Demo", href: "/", variant: "outline" },
                    ]}
                image={{
                    src: "https://oud.pics/m/4b65-89e7-f905b2c1a789/b9bd4cf2-1dc4.png",
                    alt: "Hero banner",
                }}
            />
        </>
    )
}