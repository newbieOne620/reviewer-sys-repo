// api/upload.js

import { pool } from "../../lib/db";

import { NextResponse } from "next/server";
const { v4: uuidv4 } = require("uuid");

export async function POST(request) {
  try {
    // Parse the incoming request JSON
    const res = await request.json();

    const { filedesc, filename } = res;

    const dateCreated = new Date();
    const uniqueId = uuidv4();

    const query = `
      INSERT INTO pdf_tbl (file_uuid, file_desc, upload_date, file_name)
      VALUES ($1, $2, $3, $4)
    
    `;
    const values = [uniqueId, filedesc, dateCreated, filename];

    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      return NextResponse.json(
        { success: true, message: "PDF file uploaded to pgadmin" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Error on uploading pdf file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return NextResponse.json({
      success: false,
      message: "Error uploading PDF",
      error: error.message,
    });
  }
}

export async function GET() {
  try {
    // Perform a SELECT query to get all records from tbl_user
    const result = await pool.query("SELECT * FROM pdf_tbl");

    if (result.rowCount > 0) {
      return NextResponse.json(
        { success: true, data: result.rows },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
