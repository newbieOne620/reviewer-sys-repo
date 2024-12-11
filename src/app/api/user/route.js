import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";
const { v4: uuidv4 } = require("uuid");

export async function POST(request) {
  try {
    const res = await request.json();

    const { fname, mname, lname, level, email, password, filename } = res;
    const datecreate = new Date(); // Format as ISO string if needed
    const uniqueId = uuidv4();

    const query = `INSERT INTO usr_tbl (usr_uuid, usr_fname, usr_mname, usr_lname, usr_lvl, usr_datecreate, usr_email, usr_password, usr_img) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

    const values = [
      uniqueId,
      fname,
      mname,
      lname,
      level,
      datecreate,
      email,
      password,
      filename,
    ];
    const result = await pool.query(query, values);
    if (result.rowCount > 0) {
      return NextResponse.json(
        { success: true, message: "User created successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Error creating user" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
}

export async function GET() {
  try {
    // Perform a SELECT query to get all records from tbl_user
    const result = await pool.query("SELECT * FROM usr_tbl");

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

export async function PUT(request) {
  try {
    const res = await request.json();

    const { userid, fname, mname, lname, filename, email } = res;
    const updatedate = new Date(); //date updated
    // Update query
    const query = `
      UPDATE usr_tbl
      SET usr_fname = $1,
          usr_mname = $2,
          usr_lname = $3,
          usr_img = $4,
          usr_email = $5,
          usr_dateupdate = $6
      WHERE usr_id = $7
    `;

    const values = [fname, mname, lname, filename, email, updatedate, userid];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      return NextResponse.json(
        { success: true, message: "User updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "User not found or no changes made" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating user", error: error.message },
      { status: 500 }
    );
  }
}
