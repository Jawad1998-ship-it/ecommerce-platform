import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, RoleRoutes } from "./types/types";

const privateRoutes: string[] = ["/dashboard", "/products/*"];
const publicRoutes: string[] = [
  "/home",
  "/signin",
  "/signup",
  "/products/*",
  "/cart",
  "/signup/activation",
  "/settings",
  "/dashboard",
  "/user/profile",
  "/business",
];
const roleRoutes: RoleRoutes = {
  admin: [...privateRoutes, ...publicRoutes],
  customer: publicRoutes,
};

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const isProductRoute = pathname.startsWith("/products");
  // If it's a product route, check user role and authentication
  if (isProductRoute) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get("refresh_token");
  if (!tokenCookie) {
    console.log("No auth token found");
    return NextResponse.error();
  }

  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(
      tokenCookie.value
    );

    const userRole: string = decodedToken.userRole;
    const userVerified: boolean = decodedToken.userVerified;

    const allowedRoutes = roleRoutes[userRole] || [];
    // Check if the current path is allowed for this user role
    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (
      isAllowed &&
      !userVerified &&
      (pathname !== "/signup/activation" || pathname !== "/signin")
    ) {
      return NextResponse.redirect(new URL("/signup/activation", request.url));
    }
    if (isAllowed) {
      return NextResponse.next();
    } else {
      // Redirect to an appropriate page (home or access denied)
      return NextResponse.error();
    }
  } catch (error) {
    console.error("Token decode error:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
