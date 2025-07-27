# การใช้ NextAuth, prisma, bcrypt

> เราจะใช้ prisma ในการทำ ORM

```bash
npm install prisma --save-dev
npm install @prisma/client # สำหรับใช้ใน Next.js ทำการลงไว้ก่อนเลย
```

## Step 1 หลังจากนั้น ให้ทำการพิมพ์คำสั่งนี้เพื่อเริ่มต้น schema file ของ Prisma ออกมา

```bash
npx prisma init
```

## Step 2 สร้างตาราง

```bash
model User {
  id    Int    @id @default(autoincrement())
  name  String?
  email String @unique
  password String
  image String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Step 3 migrate prisma กับ ฐานข้อมูล

```bash
npx prisma migrate dev --name ชื่อที่จะตั้ง
```

## Step 4 สร้าง API สำหรับ Signup

> /api/auth/signup/route.js

## Step 5 ทำ hash password

```bash
ืnpm install bcrypt
```

## หลังจากสร้าง Signup API แล้ว

1. ลง next-Auth
   > เริ่มใช่งาน NextAuth

```bash
npm install next-auth
```

2. ลง Adapters ของ Auth
   > `https://next-auth.js.org/adapters`

```bash
npm install @prisma/client @auth/prisma-adapter
npm install prisma --save-dev
```

## สร้าง หน้า login 
> /app/page.js


## .env
```bash
DATABASE_URL= DATABASE_URL = mysql://USER:PASSWORD@HOST:PORT/DATABASE

# The following `prisma+sqlite` URL is similar to the URL produced by running a local Prisma SQLite
NEXTAUTH_SECRET="98E3B2CC28F61492C6934531C828CF0B"
NEXTAUTH_URL=http://localhost:3000/
```