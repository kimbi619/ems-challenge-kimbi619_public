import type { ActionFunction } from "react-router";
import bcrypt from "bcryptjs";
import { getDB } from "~/db/getDB";
import { verifyToken } from "~/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path"


const saveFile = async (file: File, uploadDir: string, publicBasePath: string): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `${publicBasePath}/${filename}`;
};

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
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Authentication token required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const formData = await request.formData();
    
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const hire_date = formData.get("hire_date") as string;
    const salary = formData.get("salary") as string;
    const department = formData.get("department") as string;
    const job_title = formData.get("job_title") as string;
    const manager_id = formData.get("manager_id") as string;
    const role = formData.get("role") as string;
    const initial_salary = formData.get("initial_salary") as string;
    const identification_number = formData.get("identification_number") as string;
    const date_of_birth = formData.get("date_of_birth") as string;
    let avatar_url = null;
    let cv_url = null;
    let document_url = null;

    const avatar = formData.get("avatar") as File;
    const cv = formData.get("cv") as File;
    const employment_certificate = formData.get("employment_certificate") as File;

    if (avatar && avatar.size > 0) {
        const uploadDir = path.join(process.cwd(), "public", "avatars");
        avatar_url = await saveFile(avatar, uploadDir, "/avatars");
    }

    if (cv && cv.size > 0) {
        const uploadDir = path.join(process.cwd(), "public", "cv");
        cv_url = await saveFile(cv, uploadDir, "/cv");
    }

    if (employment_certificate && employment_certificate.size > 0) {
        const uploadDir = path.join(process.cwd(), "public", "documents");
        document_url = await saveFile(employment_certificate, uploadDir, "/documents");
    }

    if (!first_name || !last_name || !email || !password || !hire_date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = await getDB();

    const existingEmployee = await db.get(
      'SELECT id FROM employees WHERE email = ?',
      [email]
    );

    if (existingEmployee) {
      return new Response(
        JSON.stringify({ error: "Email already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    let role_id = null;
    if (role) {
      const existingRole = await db.get(
        'SELECT id FROM roles WHERE name = ?',
        [role]
      );
      
      if (existingRole) {
        role_id = existingRole.id;
      } else {
        const result = await db.run(
          'INSERT INTO roles (name) VALUES (?)',
          [role]
        );
        role_id = result.lastID;
      }
    }

    const result = await db.run(
      `INSERT INTO employees (first_name, last_name, email, phone, password_hash, hire_date, current_salary, department, job_title, manager_id, role_id, initial_salary, identification_number, date_of_birth, avatar_url, cv_url, id_document_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, password_hash, hire_date, salary, department, job_title, manager_id || null, role_id, initial_salary, identification_number || null, date_of_birth || null, avatar_url, cv_url, document_url]
    );

    const newEmployee = await db.get(
      'SELECT id, first_name, last_name, email FROM employees WHERE id = ?',
      [result.lastID]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Employee created successfully",
        data: newEmployee
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Error creating employee:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create employee" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};