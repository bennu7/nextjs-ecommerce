import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", {
        status: 400,
      });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return new NextResponse(JSON.stringify(billboard), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [BILLBOARD_GET] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; billboardId: string };
  }
) {
  console.log(
    "🚀 ~ file: route.ts:13 ~ params.billboardId:",
    params.billboardId
  );
  console.log("🚀 ~ file: route.ts:13 ~ params.storeId:", params.storeId);
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!label || !imageUrl) {
      return new NextResponse("label or imageUrl is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return new NextResponse(JSON.stringify(billboard), { status: 200 });
  } catch (error) {
    console.log("⚠️ ERR [BILLBOARD_billboardId_PATCH] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", {
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

    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return new NextResponse(JSON.stringify(billboard), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [BILLBOARD_DELETE] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
