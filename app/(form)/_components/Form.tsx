"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormItem,
	FormLabel,
	FormMessage,
	FormField,
	FormControl,
} from "@/components/ui/form";

import { useEdgeStore } from "@/lib/edgestore";

const formSchema = z.object({
	from: z.string().min(1, { message: "Email is required" }).email(),
	to: z.string().min(1, { message: "Email is required" }).email(),
	password: z.string().min(1, { message: "Password is required" }),
	subject: z.string().min(1, { message: "Subject is required" }),
	content: z.string().min(1, { message: "Message is required" }),
	recipientName: z.string().min(1, { message: "Recipient Name is required" }),
	recruiterName: z.string().min(1, { message: "Recruiter Name is required" }),
	file: z
		.instanceof(FileList)
		.refine((file) => file?.length == 1, "File is required."),
	emailFile: z.instanceof(FileList).optional(),
});

interface InputFormProps {
	multipleEmails?: boolean;
}

export default function InputForm({ multipleEmails }: InputFormProps) {
	const { edgestore } = useEdgeStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			from: "",
			password: "",
			to: "",
			content: "",
			subject: "",
			recipientName: "",
			recruiterName: "",
		},
	});

	const fileRef = form.register("file");
	const emailFileRef = form.register("emailFile");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);

		const file = values.file[0];
		const emailFile = values.emailFile?.[0];

		console.log(file);

		const res = await edgestore.publicFiles.upload({
			file,
		});
		let emailRes;
		if (emailFile) {
			emailRes = await edgestore.publicFiles.upload({
				file: emailFile,
			});
		}

		console.log(res);

		const response = await fetch("/api/nodemailer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...values,
				file: res.url,
				emailFile: emailRes?.url,
			}),
		});

		toast.promise(response.json(), {
			loading: "Sending email...",
			success: "Email sent successfully!",
			error: "Failed to send email!",
		});

		form.reset();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full max-w-2xl mt-[20rem] sm:mt-40 mb-4 relative z-10"
			>
				<div className="flex flex-col sm:flex-row justify-between gap-1 items-center">
					<FormField
						control={form.control}
						name="recipientName"
						render={({ field }) => (
							<FormItem className="w-full sm:w-1/2 dark:text-white text-black text-xl">
								<FormLabel>Recipient's Name</FormLabel>
								<FormControl>
									<Input placeholder="Manik Dingra" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="recruiterName"
						render={({ field }) => (
							<FormItem className="w-full sm:w-1/2 dark:text-white text-black text-xl">
								<FormLabel>Recruiter's Name</FormLabel>
								<FormControl>
									<Input placeholder="Microsoft's Team" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col sm:flex-row justify-between gap-1 items-center">
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
					<FormField
						control={form.control}
						name="from"
						render={({ field }) => (
							<FormItem className="w-full sm:w-1/2 dark:text-white text-black text-xl">
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
							<FormItem className="w-full sm:w-1/2 dark:text-white text-black text-xl">
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
				<Button className="mt-4 w-full" type="submit">
					Submit
				</Button>
			</form>
		</Form>
	);
}
