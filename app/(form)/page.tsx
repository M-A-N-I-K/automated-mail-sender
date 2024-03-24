import { AuroraBackground } from "@/components/ui/aurora-background";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const Hero = () => {
	return (
		<AuroraBackground>
			<div className="flex flex-col items-center gap-6">
				<h1 className="text-6xl text-[#1f2937] dark:text-white font-bold tracking-tight text-center sm:text-6xl">
					Unleash Personalized Email Experiences, Tailored to You.
				</h1>
				<p className="text-center text-xl text-muted-foreground">
					EmailEase - Send emails with ease
				</p>
				<HoverBorderGradient>Start Now!</HoverBorderGradient>
			</div>
		</AuroraBackground>
	);
};

export default Hero;
