import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";

const Hero = () => {
	return (
		<>
			<div className="flex flex-col items-center gap-6">
				<h1 className="text-6xl text-[#1f2937] dark:text-white font-bold tracking-tight text-center sm:text-6xl">
					Unleash Personalized Email Experiences, Tailored to You.
				</h1>
				<p className="text-center text-xl text-muted-foreground">
					EmailEase - Send emails with ease
				</p>
				<Link href="/single-email">
					<HoverBorderGradient>Start Now!</HoverBorderGradient>
				</Link>
			</div>
		</>
	);
};

export default Hero;
