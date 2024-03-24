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

	await new Promise((resolve, reject) => {
		// verify connection configuration
		transporter.verify(function (error: any, success: any) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log("Server is ready to take our messages");
				resolve(success);
			}
		});
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

	let result: any[] = [];

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

			await new Promise((resolve, reject) => {
				transporter.sendMail(mailOptions, function (error: any, info: any) {
					if (error) {
						reject(error);
						result.push(error);
						console.log(error);
					} else {
						result.push(info);
						console.log(
							"Email sent to",
							mailOptions.to,
							":",
							info.response
						);
						resolve(info);
					}
				});
			});
		}
	} else {
		await new Promise((resolve, reject) => {
			transporter.sendMail(mailOptions, function (error: any, info: any) {
				if (error) {
					reject(error);
					console.log(error);
				} else {
					resolve(info);
					result = info;
				}
			});
		});
	}

	return NextResponse.json({ status: "success", data: result });
}
