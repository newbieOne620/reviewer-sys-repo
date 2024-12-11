import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Define protected routes
  const secrets = process.env.NEXTAUTH_SECRET;
  const protectedRoutes = ["/dashboard", "/userlist", "/filelist"];

  // Check if the current request is to a protected route
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const token = await getToken({
      req,
      secret: secrets,
    });
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  const protectedApi = ["/api/user"];
  if (protectedApi.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const token = await getToken({ req, secret: secrets });
    // If there's no token (no session), return a 401 Unauthorized response
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/userlist/:path*",
    "/dashboard/:path*",
    "/filelist/:path*",
    "/api/user/:path*",
  ],
};
