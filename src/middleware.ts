import NextAuth from "next-auth";
import authConfig from "@/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vocabulary/:path*",
    "/quizzes/:path*",
    "/progress/:path*",
    "/login",
    "/register",
  ],
};