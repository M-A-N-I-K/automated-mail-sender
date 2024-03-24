import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";
import { MotionH1, MotionP } from "./_components/MotionElements";

const Hero = () => {
	const variants = {
		hidden: { opacity: 0, x: 0, y: 100 },
		enter: { opacity: 1, x: 0, y: 0 },
	};

	return (
		<>
			<div className="flex flex-col items-center gap-6">
				<MotionH1
					variants={variants}
					initial="hidden"
					animate="enter"
					transition={{ duration: 0.5, ease: "easeInOut" }}
					className="text-3xl sm:text-5xl md:text-6xl text-[#1f2937] dark:text-white font-bold tracking-tight text-center"
				>
					Unleash Personalized Email Experiences, Tailored to You.
				</MotionH1>
				<MotionP
					variants={variants}
					initial="hidden"
					animate="enter"
					transition={{ duration: 0.5, ease: "easeInOut" }}
					className="text-center text-md md:text-xl text-muted-foreground"
				>
					EmailEase - Send emails with ease
				</MotionP>
				<Link href="/single-email">
					<HoverBorderGradient>Start Now!</HoverBorderGradient>
				</Link>
			</div>
		</>
	);
};

export default Hero;
