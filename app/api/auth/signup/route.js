import bcrypt from "bcrypt"; // นำเข้า bcrypt สำหรับการเข้ารหัสรหัสผ่าน
import { PrismaClient } from "@prisma/client"; // นำเข้า PrismaClient สำหรับการเชื่อมต่อกับฐานข้อมูล

const prisma = new PrismaClient(); // สร้างอินสแตนซ์ของ PrismaClient

export async function POST(request) {
  try {
    const { name, email, password } = await request.json(); // รับข้อมูล JSON จาก request
    const hashedPassword = bcrypt.hashSync(password, 10); // เข้ารหัสรหัสผ่านด้วย bcrypt

    const newUser = await prisma.user.create({
      // สร้างผู้ใช้ใหม่ในฐานข้อมูล
      data: {
        name,
        email,
        password: hashedPassword, // ใช้รหัสผ่านที่เข้ารหัสแล้ว
      },
    });

    return Response.json(
      {
        message: "User created successfully",
        user: { // ส่งข้อมูลผู้ใช้กลับ
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating user:", error); // แสดงข้อผิดพลาดในคอนโซล
    return Response.json({ error: "Unable to create user" }, { status: 500 });
  }
}
