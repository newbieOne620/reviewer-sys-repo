import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const res = await request.json();
    const { status, userid } = res;

    const query = `
      UPDATE usr_tbl 
      SET usr_status = $1 
      WHERE usr_id = $2
    `;
    const values = [status, userid];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      result,
    });
  } catch (error) {
    console.error("Error updating user status:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error updating status",
        error: error.message, // Include error message for debugging
      },
      { status: 500 } // HTTP 500 for server error
    );
  }
}
