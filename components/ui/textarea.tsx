import * as React from "react";

import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		const radius = 100; // change this to increase the rdaius of the hover effect
		const [visible, setVisible] = React.useState(false);

		let mouseX = useMotionValue(0);
		let mouseY = useMotionValue(0);

		function handleMouseMove({ currentTarget, clientX, clientY }: any) {
			let { left, top } = currentTarget.getBoundingClientRect();

			mouseX.set(clientX - left);
			mouseY.set(clientY - top);
		}
		return (
			<motion.div
				style={{
					background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        var(--blue-500),
        transparent 80%
      )
    `,
				}}
				onMouseMove={handleMouseMove}
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				className="p-[2px] rounded-lg transition duration-300 group/input"
			>
				<textarea
					className={cn(
						"flex min-h-[80px] w-full bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					ref={ref}
					{...props}
				/>
			</motion.div>
		);
	}
);
Textarea.displayName = "Textarea";

export { Textarea };
