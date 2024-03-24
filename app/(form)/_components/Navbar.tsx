"use client";
import useScrollTop from "@/hooks/use-scroll-top";

import { ModeToggle } from "@/components/modeToggle";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
	const scrolled = useScrollTop();
	return (
		<div
			className={cn(
				"z-50 bg-transparent fixed top-0 flex items-center w-full p-6",
				scrolled && "border-b shadow-sm"
			)}
		>
			<Logo />
			<div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
				<Link href="/single-email">
					<Button size="lg">Send Single Mail</Button>
				</Link>
				<Link href="/multiple-email">
					<Button size="lg">Send Multiple Mails</Button>
				</Link>
				<ModeToggle />
			</div>
		</div>
	);
};
