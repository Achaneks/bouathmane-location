import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
