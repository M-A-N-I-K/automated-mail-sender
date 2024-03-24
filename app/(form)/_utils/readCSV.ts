// utils/readCsv.ts

export async function readCsv(file: File): Promise<Record<string, string>[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = function (event) {
			const csv = event.target?.result as string;
			const rows = csv.split("\n").map((row) => row.trim());

			// Extract headers from the first row
			const headers = rows.shift()?.split(",") ?? [];

			// Map each row to an object with headers
			const data = rows.reduce((acc: Record<string, string>[], row) => {
				const values = row.split(",");
				const rowData: Record<string, string> = {};
				values.forEach((value, index) => {
					if (value !== null && value !== "") {
						rowData[headers[index]] = value;
					}
				});
				if (Object.keys(rowData).length > 0) {
					acc.push(rowData);
				}
				return acc;
			}, []);

			resolve(data);
		};

		reader.onerror = function () {
			reject(new Error("Error reading the file"));
		};

		reader.readAsText(file);
	});
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
