"use client";
import Link from "next/link";
import { Mail } from "lucide-react";
import Image from "next/image";

import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import useScrollTop from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";

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
					<Button className="hidden sm:block" size="lg">
						Send Single Mail
					</Button>
					<Mail className="block sm:hidden" size={24} />
				</Link>
				<Link href="/multiple-email">
					<Button className="hidden sm:block" size="lg">
						Send Multiple Mails
					</Button>
					<Image
						src="/multiple-mail.svg"
						alt="Multiple Mail"
						className="block font-bold sm:hidden"
						width={32}
						height={32}
					/>
				</Link>
				<ModeToggle />
			</div>
		</div>
	);
};
