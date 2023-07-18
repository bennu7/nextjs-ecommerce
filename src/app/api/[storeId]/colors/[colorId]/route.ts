import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface ICategoryId {
  params: {
    storeId: string;
    colorId: string;
  };
}

export async function GET(req: Request, { params }: ICategoryId) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color id is required", {
        status: 400,
      });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return new NextResponse(JSON.stringify(color), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [COLOR_GET] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: ICategoryId) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name || !value) {
      return new NextResponse("name or value is required", {
        status: 400,
      });
    }
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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

    const category = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
        storeId: params.storeId,
      },
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.log("⚠️ ERR [COLOR_Id_PATCH] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: ICategoryId) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", {
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

    const category = await prismadb.color.delete({
      where: {
        id: params.colorId,
      },
    });

    return new NextResponse(JSON.stringify(category), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [COLOR_DELETE] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
