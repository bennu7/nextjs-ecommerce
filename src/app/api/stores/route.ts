import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Missing name", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return new NextResponse(JSON.stringify(store), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("⚠️ ERR [STORES_POST] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId, getToken } = auth();
  console.log("🚀 ~ file: route.ts:39 ~ GET ~ getToken:", getToken);

  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  const data = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return new NextResponse(JSON.stringify(data), {
    status: 200,
  });
}
