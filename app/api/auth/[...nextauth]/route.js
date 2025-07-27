import NextAuth from "next-auth"; // นำเข้า NextAuth สำหรับการจัดการการยืนยันตัวตน
import CredentialsProvider from "next-auth/providers/credentials"; // นำเข้า CredentialsProvider สำหรับการยืนยันตัวตนด้วยข้อมูลประจำตัว
import bcrypt from "bcrypt"; // นำเข้า bcrypt สำหรับการเข้ารหัสรหัสผ่าน
import { PrismaClient } from "@prisma/client"; // นำเข้า PrismaClient สำหรับการเชื่อมต่อกับฐานข้อมูล
import { PrismaAdapter } from '@auth/prisma-adapter' // นำเข้า PrismaAdapter สำหรับ NextAuth

const prisma = new PrismaClient(); // สร้างอินสแตนซ์ของ PrismaClient

export const authOptions = {
  // กำหนดตัวเลือกสำหรับ NextAuth
  providers: [
    CredentialsProvider({
      // กำหนดผู้ให้บริการ Credentials
      name: "Credentials", // กำหนดชื่อของผู้ให้บริการ
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        }, // กำหนดฟิลด์สำหรับอีเมล
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        }, // กำหนดฟิลด์สำหรับรหัสผ่าน
      },

      // ฟังก์ชันสำหรับการยืนยันตัวตนผู้ใช้ สำหรับตรวจสอบ การเข้าสู่ระบบ ของเราเอง
      async authorize(credentials, request) {
        // ฟังก์ชันสำหรับยืนยันตัวตนผู้ใช้
        if (!credentials) {
          throw new Error("Invalid credentials");
        }
        // ค้นหาผู้ใช้ในฐานข้อมูลตามอีเมล
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // ตรวจสอบว่ามีผู้ใช้ หรือไม่
        if (!user) {
          throw new Error("User not found");
        }

        // ตรวจสอบ user และ  รหัสผ่าน
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id, // คืนค่า ID ของผู้ใช้
            name: user.name, // คืนค่าชื่อของผู้ใช้
            email: user.email, // คืนค่าอีเมลของผู้ใช้
            role: user.role, // คืนค่าบทบาทของผู้ใช้
          }; // คืนค่าผู้ใช้หากรหัสผ่านถูกต้อง
        } else {
          throw new Error("Invalid email or password"); // ขว้างข้อผิดพลาดหากรหัสผ่านไม่ถูกต้อง
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma), // ใช้ PrismaAdapter สำหรับ NextAuth
  // กำหนด adapter สำหรับ NextAuth เพิ่อเชื่อมต่อกับ Prisma
  session: {
    // กำหนดการจัดการ session
    // จัดการ session ของผู้ใช้ โดยใช้ JWT
    strategy: "jwt", // ใช้ JWT สำหรับการจัดการ session
  },

  // กำหนดการจัดการ session ของผู้ใช้
  callbacks: {
    // กำหนด callbacks สำหรับ NextAuth
    // callbacks คือฟังก์ชันที่ถูกเรียกในช่วงต่าง ๆ ของการยืนยันตัวตน
    jwt: async ({ token, user }) => {
      // ฟังก์ชันสำหรับจัดการ JWT token
      // token คือข้อมูลที่ถูกเก็บใน JWT
      if (user) {
        // ถ้ามีผู้ใช้ (user) ถูกส่งมาใน token
        token.id = user.id; // เก็บ ID ของผู้ใช้ใน token
        token.role = user.role; // เก็บบทบาทของผู้ใช้ใน token (ถ้ามี)
      }
      return token; // คืนค่า token ที่มี ID ของผู้ใช้
    },
    session: async ({ session, token }) => {
      if (session.user) {
        // session.user คือข้อมูลผู้ใช้ใน session
        // ถ้ามี session.user
        session.user.id = token.id; // เก็บ ID ของผู้ใช้ใน session.user
        session.user.role = token.role; // เก็บบทบาทของผู้ใช้ใน session.user
      }
      return session; // คืนค่า session ที่มี ID ของผู้ใช้
    },
  },
};

const handler = NextAuth(authOptions); // สร้าง handler สำหรับ NextAuth ด้วยตัวเลือกที่กำหนด
export { handler as GET, handler as POST }; // ส่งออก handler สำหรับ GET และ POST requests
