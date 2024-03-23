import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
const nodemailer = require("nodemailer");

export async function POST(req: NextRequest) {
	const data = await req.json();

	console.log(data);

	const htmlTemplate = fs.readFileSync("public/email_template.html", "utf8");
	const htmlContent = htmlTemplate
		.replace("{{recipientName}}", data.recipientName)
		.replace("{{recruiterName}}", data.recruiterName)
		.replace("{{content}}", data.content.replace(/\n/g, "<br>"));

	const transporter = nodemailer.createTransport({
		service: "Gmail",
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

	const info = await transporter.sendMail(mailOptions);

	return NextResponse.json(info);
}
