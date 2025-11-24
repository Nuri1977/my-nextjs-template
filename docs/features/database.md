# **Database System**

## **Overview**
The project uses **PostgreSQL** as the relational database, managed by **Prisma ORM**. This setup ensures type-safe database access, schema management via migrations, and seamless integration with the authentication system.

## **Configuration**

### **Prisma Setup**
*   **Schema File**: `prisma/schema.prisma`
*   **Client Instance**: `src/lib/prisma.ts`
*   **Environment Variable**: `DATABASE_URL` (PostgreSQL connection string)

### **Prisma Client (`src/lib/prisma.ts`)**
The Prisma client is instantiated as a singleton to prevent connection exhaustion in serverless environments (like Next.js during development).
*   **Logging**: Query logging is enabled (`log: ["query"]`) for debugging purposes.

## **Schema Models**

The schema is primarily designed to support **Better Auth** but is extensible for application-specific data.

### **1. User (`model User`)**
Represents the application user.
*   **Fields**:
    *   `id`: UUID (Primary Key)
    *   `email`: Unique, Optional (for OAuth flows)
    *   `password`: Hashed password (Optional)
    *   `isAdmin`: Boolean (Default: `false`) - Custom field for RBAC.
    *   `emailVerified`: Boolean
    *   `image`: URL to avatar
*   **Relations**:
    *   `sessions`: One-to-Many
    *   `accounts`: One-to-Many

### **2. Session (`model Session`)**
Manages active user sessions.
*   **Fields**: `token`, `expiresAt`, `ipAddress`, `userAgent`.
*   **Relation**: Belongs to `User`.

### **3. Account (`model Account`)**
Stores OAuth provider details (e.g., Google, GitHub) or other linked accounts.
*   **Fields**: `providerId`, `accountId`, `accessToken`, `refreshToken`.
*   **Relation**: Belongs to `User`.

### **4. Verification (`model Verification`)**
Handles temporary tokens for email verification and password resets.
*   **Fields**: `identifier`, `value` (token), `expiresAt`.

## **Common Commands**

### **Migrations**
*   **Create Migration**: `npx prisma migrate dev --name <migration_name>`
    *   *Usage*: Run this after modifying `schema.prisma` to apply changes to the DB and generate the client.
*   **Reset Database**: `npx prisma migrate reset`
    *   *Usage*: Wipes the database and re-applies all migrations.

### **Studio**
*   **Open GUI**: `npx prisma studio`
    *   *Usage*: Opens a web interface to view and edit database records.

### **Generation**
*   **Generate Client**: `npx prisma generate`
    *   *Usage*: Updates `node_modules/@prisma/client` after schema changes.

## **Best Practices**
1.  **Schema Changes**: Always use `migrate dev` locally. Never edit the database directly.
2.  **Type Safety**: Use the auto-generated types from `@prisma/client` in your application code.
3.  **Global Instance**: Always import the `prisma` instance from `@/lib/prisma` instead of creating a new `PrismaClient()`.
