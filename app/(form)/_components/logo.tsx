import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const font = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const Logo = () => (
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
		<Link href="/">
			<p
				className={cn(
					"font-semibold text-[#1f2937] cursor-pointer dark:text-white",
					font.className
				)}
			>
				EmailEase
			</p>
		</Link>
	</div>
);
