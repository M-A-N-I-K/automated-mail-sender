import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { delay } from "@/app/(form)/_utils/readCSV";

const nodemailer = require("nodemailer");

export async function POST(req: NextRequest) {
	const data = await req.json();

	console.log(data);

	const htmlTemplate = fs.readFileSync("public/email_template.html", "utf8");
	let htmlContent = htmlTemplate
		.replace("{{senderName}}", data.senderName)
		.replace("{{content}}", data.content.replace(/\n/g, "<br>"));

	if (data.senderName) {
		htmlContent = htmlContent.replace(
			"{{recipientName}}",
			data.recipientName
		);
	}

	const transporter = nodemailer.createTransport({
		service: "gmail",
		port: 587,
		auth: {
			user: data.from,
			pass: data.password,
		},
	});

	const mailOptions = {
		from: data.from,
		to: data.to,
		subject: data.subject,
		html: htmlContent,
		attachments: [
			{
				filename: "resume.pdf",
				path: data.file,
			},
		],
	};

	let info = [];

	if (data.emailFile && data.emailFile.length > 0) {
		for (
			let currentIndex = 0;
			currentIndex < data.emailFile.length;
			currentIndex++
		) {
			await delay(data.delay * 1000);
			mailOptions.to = data.emailFile[currentIndex].Email;
			mailOptions.subject = data.emailFile[currentIndex].Subject;
			mailOptions.html = htmlTemplate
				.replace(
					"{{recipientName}}",
					data.emailFile[currentIndex].Recipient
				)
				.replace("{{senderName}}", data.senderName)
				.replace(
					"{{content}}",
					data.emailFile[currentIndex].Content.replace(/\n/g, "<br>")
				);

			try {
				const res = await transporter.sendMail(mailOptions);
				console.log("Email sent to", mailOptions.to, ":", res.response);
				info.push(res);
			} catch (error) {
				console.error("Error sending email to", mailOptions.to, ":", error);
				info.push(error);
			}
		}
	} else {
		info = await transporter.sendMail(mailOptions);
	}

	return NextResponse.json(info);
}
