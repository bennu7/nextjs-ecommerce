import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
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
    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return new NextResponse(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.log("⚠️ ERR [STORES_storeId_PATCH] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });
    console.log("🚀 ~ DELETED store:", store);

    return new NextResponse(JSON.stringify(store), { status: 200 });
  } catch (error) {
    console.log("⚠️ ERR [STORES_storeId_DELETE] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
