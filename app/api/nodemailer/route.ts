import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import XLSX from "xlsx";
import axios from "axios";

const csvParse = require("csv-parse").parse;
const nodemailer = require("nodemailer");

// Parse CSV file
function parseCSV(filePath: string) {
	console.log("Parsing CSV file");
	const fileContent = fs.readFileSync(filePath, "utf8");
	const records = csvParse(fileContent, { columns: true });
	return records;
}

// Parse Excel file
function parseExcel(filePath: Buffer) {
	const workbook = XLSX.read(filePath, { type: "buffer" });
	const sheetName = workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];
	return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

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

	if (data.emailFile) {
		try {
			// const response = await axios.get(data.emailFile, {
			// 	responseType: "arraybuffer",
			// });
			// const fileContent = Buffer.from(response.data, "binary");

			// console.log("File Content:", fileContent);

			let emailFileData;
			// if (data.emailFile.endsWith(".xlsx")) {
			// 	emailFileData = parseExcel(fileContent);
			// } else if (data.emailFile.endsWith(".csv")) {
			emailFileData = parseCSV(data.emailFile);
			// }

			console.log("Email File Data:", emailFileData);
		} catch (error) {
			console.error("Error fetching or parsing email file:", error);
		}
	}

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

	// const info = await transporter.sendMail(mailOptions);
	const info = "message sent";
	return NextResponse.json(info);
}
