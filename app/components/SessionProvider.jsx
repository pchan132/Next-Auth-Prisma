"use client";

// นำเข้า SessionProvider จาก next-auth/react เพื่อจัดการ session ของผู้ใช้
// การใช้ SessionProvider ช่วยให้เราสามารถเข้าถึงข้อมูล session ของผู้ใช้ในคอมโพเนนต์ React ได้
// แต่ SessionProvider ไม่สามารถใช้ในผู้ใช้ฝั่งเซิร์ฟเวอร์ได้
// ดังนั้นจึงต้องใช้ในคอมโพเนนต์ที่เป็น "use client


import { SessionProvider } from "next-auth/react"; // นำเข้า SessionProvider จาก next-auth/react
export default SessionProvider; // ส่งออก SessionProvider เป็นค่าเริ่มต้น

// การส่งออกนี้จะทำให้เราสามารถใช้ SessionProvider ในคอมโพเนนต์อื่น ๆ ได้ 
// โดยการห่อหุ้มคอมโพเนนต์ที่ต้องการเข้าถึง session ของผู้ใช้ โดยการใช้ SessionProvider นี้ ใน server side อื่นได้
// ใน layout หรือคอมโพเนนต์หลักของแอปพลิเคชัน