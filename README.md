# email-auth

A lightweight, type-safe email authentication package for Node.js applications. This package provides OTP generation, email delivery, and verification functionality.

## Installation

```bash
npm i @biswajitaich/email-auth
```

## Features

- Generate secure one-time passwords (OTPs)
- Send OTPs via email using nodemailer
- Store and verify OTPs with expiration time
- Written in TypeScript for better type safety

## Usage

### Setup Environment Variables

Create a `.env` file in your project root:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password 
```

### Basic Usage in NextJs api route:

```typescript
import { generateOtp, sendEmail, storeHashedOtp, verifyOtp, hashOtp } from 'email-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const email = "emailToVerify@gmail.com";

        // Step 1: Generate OTP
        const otp = generateOtp();

        // Step 2: Send Email
        await sendEmail(email, otp);

        // Step 3: Hash & Store OTP
        const hashedOtp = hashOtp(otp);
        storeHashedOtp(email, hashedOtp);

        // Step 4: Verify OTP (for testing/demo — in real app this would be POST with user input)
        const isValid = verifyOtp(email, otp); // Should return true if verified

        return NextResponse.json({
            message: "OTP sent successfully",
            isValid   
        });
    } catch (error) {
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}

```

## API Reference

### `generateOtp(): string`
Generates a secure 6-digit OTP.

### `hashOtp(otp: string): string`
Creates a SHA-256 hash of the OTP.

### `storeHashedOtp(email: string, hash: string): void`
Stores a hashed OTP for a specific email with a 5-minute expiration.

### `verifyOtp(email: string, otp: string): boolean`
Verifies if the provided OTP matches the stored one and hasn't expired.

### `sendEmail(to: string, otp: string): Promise<void>`
Sends an email containing the OTP to the specified address.

