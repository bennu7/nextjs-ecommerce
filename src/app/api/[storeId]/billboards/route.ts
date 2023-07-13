import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!label || !imageUrl) {
      return new NextResponse("label name or imageUrl is required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("storeId is required", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(billboard), {
      status: 201,
    });
  } catch (error) {
    console.log("⚠️ ERR [BILLBOARD_POST] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("storeId is required", {
        status: 400,
      });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(billboards), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [BILLBOARD_GET] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
