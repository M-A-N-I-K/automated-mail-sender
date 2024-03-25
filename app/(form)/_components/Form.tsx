"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { cn } from "@/lib/utils";
import {
	Form,
	FormItem,
	FormLabel,
	FormMessage,
	FormField,
	FormControl,
} from "@/components/ui/form";
import { useEdgeStore } from "@/lib/edgestore";

import { readCsv } from "../_utils/readCSV";
import { loadingStates } from "../_utils/utilities";

const validExtensions = ["pdf", "doc", "docx"];

const MAX_FILE_SIZE_MB = 5;

const toMb = (bytes: number) => {
	return bytes / 1024 / 1024;
};

const formSchema = z.object({
	from: z.string().min(1, { message: "Email is required" }).email(),
	to: z
		.string()
		.optional()
		.refine(
			(value) => {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return (
					value === "" ||
					value === null ||
					value === undefined ||
					emailRegex.test(value)
				);
			},
			{
				message: "To must be a valid email address",
			}
		),
	password: z.string().min(1, { message: "Password is required" }),
	subject: z.string().optional(),
	content: z.string().optional(),
	senderName: z.string().min(1, { message: "Sender Name is required" }),
	recipientName: z.string().optional(),
	delay: z
		.string()
		.optional()
		.refine((value) => value === undefined || !isNaN(Number(value)), {
			message: "Delay must be a valid number",
		}),
	file: z
		.unknown()
		.transform((value) => {
			return value as FileList | null | undefined;
		})
		.transform((value) => value?.item(0))
		.refine(
			(file) => {
				if (!file) {
					return true;
				}

				const fileExtension = file.name.split(".").pop();

				return !!fileExtension && validExtensions.includes(fileExtension);
			},
			{ message: `Valid types: ${validExtensions}` }
		)
		.refine(
			(file) => {
				if (!file) {
					return true;
				}

				return toMb(file.size) <= MAX_FILE_SIZE_MB;
			},
			{
				message: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
			}
		),
	emailFile: z
		.unknown()
		.transform((value) => {
			return value as FileList | null | undefined;
		})
		.transform((value) => value?.item(0))
		.optional(),
});

interface InputFormProps {
	multipleEmails?: boolean;
}

export default function InputForm({ multipleEmails }: InputFormProps) {
	const { edgestore } = useEdgeStore();
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			from: "",
			password: "",
			content: "",
			senderName: "",
			subject: "",
			recipientName: "",
			to: "",
			file: undefined,
			emailFile: undefined,
			delay: "",
		},
	});

	const fileRef = form.register("file");
	const emailFileRef = form.register("emailFile");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);

		const file = values.file;
		const emailFile = values.emailFile;

		if (!file) {
			toast.error("File is required");
			return;
		}

		const validations = {
			emailFile: {
				condition: !emailFile && multipleEmails,
				errorMessage: "Email file is required",
			},
			content: {
				condition: !multipleEmails && !values.content,
				errorMessage: "Content is required",
			},
			recipientName: {
				condition: !multipleEmails && !values.recipientName,
				errorMessage: "Recipient Name is required",
			},
			subject: {
				condition: !multipleEmails && !values.subject,
				errorMessage: "Subject is required",
			},
			to: {
				condition: !multipleEmails && !values.to,
				errorMessage: "To is required",
			},
		};

		for (const [key, { condition, errorMessage }] of Object.entries(
			validations
		)) {
			if (condition) {
				setLoading(false);
				toast.error(errorMessage);
				return;
			}
		}

		const res = await edgestore.publicFiles.upload({
			file,
		});

		let emailRes;

		if (emailFile) {
			emailRes = await readCsv(emailFile);
		}

		const response = await fetch("/api/nodemailer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...values,
				file: res.url,
				emailFile: emailRes,
			}),
		});

		if (response.ok) {
			form.reset();
		}

		setLoading(false);

		toast.promise(response.json(), {
			loading: "Sending email...",
			success: "Email sent successfully!",
			error: "Failed to send email!",
		});
	}

	return (
		<Form {...form}>
			<Loader
				loadingStates={loadingStates}
				loading={loading}
				duration={2500}
			/>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn(
					"w-full max-w-2xl mb-4 relative z-10",
					multipleEmails ? "mt-32" : "sm:mt-24 mt-[20rem]"
				)}
			>
				<div
					className={cn(
						"flex flex-col sm:flex-row justify-between gap-1 items-center"
					)}
				>
					<FormField
						control={form.control}
						name="senderName"
						render={({ field }) => (
							<FormItem
								className={cn(
									"w-full dark:text-white text-black text-xl",
									!multipleEmails && "sm:w-1/2"
								)}
							>
								<FormLabel>Sender&apos;s Name</FormLabel>
								<FormControl>
									<Input placeholder="Manik Dingra" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{!multipleEmails && (
						<FormField
							control={form.control}
							name="recipientName"
							render={({ field }) => (
								<FormItem className="w-full sm:w-1/2 dark:text-white text-black text-xl">
									<FormLabel>Recipient&apos;s Name</FormLabel>
									<FormControl>
										<Input placeholder="Microsoft Corp" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
				</div>
				<div className="flex flex-col sm:flex-row justify-between gap-1 items-center">
					{!multipleEmails && (
						<FormField
							control={form.control}
							name="to"
							render={({ field }) => (
								<FormItem className="w-full sm:w-1/2 dark:text-white text-black text-xl">
									<FormLabel>To</FormLabel>
									<FormControl>
										<Input
											placeholder="recruiter-email@gmail.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
					<FormField
						control={form.control}
						name="from"
						render={({ field }) => (
							<FormItem
								className={cn(
									"w-full dark:text-white text-black text-xl",
									!multipleEmails && "sm:w-1/2"
								)}
							>
								<FormLabel>From</FormLabel>
								<FormControl>
									<Input
										placeholder="your-email@gmail.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col sm:flex-row justify-between gap-1 items-center">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem
								className={cn(
									"w-full dark:text-white text-black text-xl",
									!multipleEmails && "sm:w-1/2"
								)}
							>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="xxx-xxx-xxx-xxx"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{!multipleEmails && (
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem className="w-full sm:w-1/2 dark:text-white text-black text-xl">
									<FormLabel>Subject</FormLabel>
									<FormControl>
										<Input
											placeholder="Ex : Application for full stack developer role"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
				</div>
				<FormField
					control={form.control}
					name="file"
					render={() => (
						<FormItem className="dark:text-white text-black text-xl">
							<FormLabel>File</FormLabel>
							<FormControl>
								<Input type="file" {...fileRef} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{multipleEmails && (
					<FormField
						control={form.control}
						name="emailFile"
						render={() => (
							<FormItem className="dark:text-white text-black text-xl">
								<FormLabel>Upload Email List File</FormLabel>
								<FormControl>
									<Input type="file" {...emailFileRef} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
				{!multipleEmails ? (
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="dark:text-white text-black text-xl">
								<FormLabel>Content</FormLabel>
								<FormControl>
									<Textarea
										rows={3}
										placeholder="Your email content goes here"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				) : (
					<FormField
						control={form.control}
						name="delay"
						render={({ field }) => (
							<FormItem className="dark:text-white text-black text-xl">
								<FormLabel>Delay</FormLabel>
								<FormControl>
									<Input
										placeholder="Delay (in secdonds)"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<Button className="mt-4 w-full" type="submit">
					Submit
				</Button>
			</form>
		</Form>
	);
}
