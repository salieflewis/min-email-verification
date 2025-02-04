# Minimal Email Verification

A secure email verification implementation following [The Copenhagen Book](https://thecopenhagenbook.com/email-verification) guidelines.

## Core Features

### Email Handling
- ✓ Case-insensitive email addresses
- ✓ Normalized to lowercase
- ✓ Whitespace trimming
- ✓ Sub-address handling (`user+tag@domain.com` → `user@domain.com`)
- ✓ 255 character limit
- ✓ Basic validation (format, domain structure)

### OTP Implementation
- ✓ 6-digit numeric codes
- ✓ Cryptographically secure generation via @oslojs/otp
- ✓ 15-minute expiration window
- ✓ Single-use tokens
- ✓ User-specific tokens

### Security Measures
- ✓ Rate limiting (10 attempts per hour)
- ✓ Secure token storage in Postgres
- ✓ Email normalization
- ✓ No token enumeration possible
- ✓ Consistent response times

## Endpoints

### POST /verify-email
Request email verification code.

### POST /verify-otp
Verify the OTP code.

## Environment Variables
- `DATABASE_URL`: Postgres connection string
- `RESEND_API_KEY`: Resend API key for email delivery
- `OTP_SECRET`: Secret for OTP generation
# min-email-verification
