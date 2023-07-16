import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface ICategoryId {
  params: {
    storeId: string;
    categoryId: string;
  };
}

export async function GET(req: Request, { params }: ICategoryId) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", {
        status: 400,
      });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return new NextResponse(JSON.stringify(category), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [CATEGORY_GET] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: ICategoryId) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name || !billboardId) {
      return new NextResponse("name or billboardId is required", {
        status: 400,
      });
    }
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.log("⚠️ ERR [CATEGORY_Id_PATCH] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: ICategoryId) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", {
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

    const category = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return new NextResponse(JSON.stringify(category), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [CATEGORY_DELETE] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
