import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/about", "/api/:path*"],
  // beforeAuth(req, evt) {
  //   if (req.nextUrl.pathname === "/:storeId/billboards") {
  //     if (req.method === "GET") {
  //       const searchParams = req.nextUrl.searchParams;
  //       const storeId = searchParams.get("storeId");
  //       console.log("HOLA middleware storeId billborards! ", storeId);

  //       return NextResponse.next();
  //     }
  //   }
  // },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
