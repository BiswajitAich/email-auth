# 📧 email-auth

A lightweight, type-safe Node.js package for **email-based OTP authentication**, optimized for performance with **Redis**. Perfect for applications that require secure, fast, and simple email verification.

---

## 📦 Installation

```bash
npm install @biswajitaich/email-auth
```

## 🚀 Features

🔒 Generate secure, time-bound one-time passwords (OTPs)

📤 Send OTPs via email using nodemailer

⚡ Store and verify OTPs in Redis for high-speed lookups

⏳ OTP expires in 5 minutes (configurable via code)

🔧 TypeScript-first with full type safety

🧼 Graceful Redis shutdown handling

## Usage

### Setup Environment Variables

Create a `.env` file in your project root:

```
# Redis Configuration
REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host
REDIS_PORT=6379

# Email SMTP Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

```

### 💡Basic Usage in NextJs api route:

```typescript

import { sendOtpEmail, verifyOtpCode } from '@biswajitaich/email-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, otp } = await req.json();

    // Step 1: Send OTP
    const result = await sendOtpEmail(email, "YourCompany");
    if (result.success) {
        return NextResponse.json({ success: true, message: result.message });
    }

    // Step 2: Verify OTP
    const verifyResult = await verifyOtpCode(email, otp);
    if (verifyResult.success) {
        return NextResponse.json({
            success: true,
            message: 'Email verified',
            data: {
                email,
                verified: true,
                timestamp: new Date().toISOString(),
            }
        });
    }

    return NextResponse.json({ success: false, message: verifyResult.message }, { status: 400 });
}


```

## API Reference

### `sendOtpEmail(email: string, from?: string): Promise<{ success: boolean; message: string }>`
Sends an OTP email to the user.

`email` — Target recipient's email

`from` (optional) — Brand name to show as sender

### `verifyOtpCode(email: string, otp: string): Promise<{ success: boolean; message: string }>`
Verifies the OTP submitted by the user.

`email` — Email used for registration/verification

`otp` — OTP entered by the user

### `closeRedisConnection(): Promise<void>`
Gracefully closes the Redis connection when the server shuts down.


## 🧠 Notes

Uses modern SET with EX instead of deprecated SETEX.

Redis ensures fast read/write with OTP TTL enforced on storage.

OTP is hashed before storing for added security.



## 📄 License
[MIT License](./LICENSE) © Biswajit Aich