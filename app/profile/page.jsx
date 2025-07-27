'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Profile() {
  const { data: session, status } = useSession()

  const router = useRouter()

  console.log('Session:', session)
  console.log('Status:', status)

  useEffect(() => {
    if (status === 'unauthenticated') { // เมื่อตรวจสอบสถานะแล้วพบว่าผู้ใช้ไม่ได้เข้าสู่ระบบ และพยายามเข้าถึงหน้าโปรไฟล์
      router.push('/') // เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
    }
  }, [status, router])

  // When after loading success and have session, show profile
  return (
    status === 'authenticated' &&
    session.user && (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          <p>
            Welcome, <b>{session.user.name}!</b>
          </p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    )
  )
}