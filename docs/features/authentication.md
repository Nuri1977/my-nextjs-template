# **Authentication System**

## **Overview**
The authentication system is powered by **Better Auth** and integrated with **Prisma** for database persistence. It provides a secure, passwordless-ready foundation with support for email/password login, email verification, and password resets.

## **Configuration**
*   **File**: `src/lib/auth.ts`
*   **Database Adapter**: Prisma (PostgreSQL)
*   **Encryption**: `bcryptjs` for password hashing.

## **Features**

### **1. Email & Password Authentication**
*   **Enabled**: Yes
*   **Auto Sign-In**: Enabled upon registration.
*   **Email Verification**: Required.
*   **Password Hashing**: Custom implementation using `bcryptjs` (Salt rounds: 10).

### **2. Email Verification**
*   **Trigger**: Sent automatically on sign-up.
*   **Mechanism**:
    *   Generates a verification token.
    *   Calls API endpoint: `/api/email/confirm-email`.
    *   Token Expiry: 1 hour (3600 seconds).
*   **Behavior**: Auto signs in the user after successful verification.

### **3. Password Reset**
*   **Trigger**: User requests password reset.
*   **Mechanism**:
    *   Generates a reset token.
    *   Calls API endpoint: `/api/email/change-password`.
    *   Token Expiry: 1 hour (3600 seconds).

### **4. User Model Extensions**
*   **`isAdmin`**: A boolean field added to the user schema to support Role-Based Access Control (RBAC). Defaults to `false`.

## **API Endpoints**
The authentication system relies on the following internal API routes for sending emails:
*   `POST /api/email/confirm-email`: Sends the verification email.
*   `POST /api/email/change-password`: Sends the password reset email.

## **Security Best Practices**
*   **Password Storage**: Passwords are never stored in plain text. They are hashed using `bcryptjs`.
*   **Token Expiry**: Verification and reset tokens have a short lifespan (1 hour) to minimize risk.
*   **Environment Variables**:
    *   `BETTER_AUTH_SECRET`: Used for signing session tokens.
    *   `NEXT_PUBLIC_APP_URL`: Used for constructing callback URLs.
