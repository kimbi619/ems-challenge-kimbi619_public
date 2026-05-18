import type { ActionFunction } from "react-router";
import bcrypt from "bcryptjs";
import { getDB } from "~/db/getDB";
import { signToken } from "~/lib/auth";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const db = await getDB();

    const employee = await db.get(
      `SELECT e.id, e.email, e.password_hash, e.first_name, e.last_name, r.name as role
       FROM employees e
       LEFT JOIN roles r ON r.id = e.role_id
       WHERE e.email = ?`,
      email
    );

    if (!employee) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const valid = await bcrypt.compare(password, employee.password_hash);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = await signToken({
      id: employee.id,
      email: employee.email,
      role: employee.role,
    });

    const responseData = {
      success: true,
      user: {
        id: employee.id,
        email: employee.email,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role || null,
      },
      token,
    };

    console.log("Sending response:", responseData);

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred during login" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
