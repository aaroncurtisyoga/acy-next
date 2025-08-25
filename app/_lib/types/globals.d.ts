export {};

// User roles
export type Roles = "admin" | "moderator" | "end-user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
      userId: string;
    };
  }
}
