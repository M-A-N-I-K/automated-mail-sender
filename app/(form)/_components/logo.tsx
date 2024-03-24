import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const Logo = () => {
	return (
		<div className="hidden md:flex items-center gap-x-2">
			<Image
				src="/logo.svg"
				alt="logo"
				className="dark:hidden"
				width={36}
				height={36}
			/>
			<Image
				src="/logo.svg"
				alt="logo dark"
				className="hidden dark:block"
				width={36}
				height={36}
			/>
			<p
				className={cn(
					"font-semibold text-[#1f2937] dark:text-white",
					font.className
				)}
			>
				EmailEase
			</p>
		</div>
	);
};
