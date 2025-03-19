import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function appendToSheet(data) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sales!A:E",
      valueInputOption: "RAW",
      resource: { values: [data] },
    });
  } catch (error) {
    console.error("Error writing to Google Sheet:", error);
  }
}