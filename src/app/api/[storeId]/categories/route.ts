import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface IStoreId {
  params: {
    storeId: string;
  };
}

export async function GET(req: Request, { params }: IStoreId) {
  try {
    if (!params.storeId) {
      return new NextResponse("storeId is required", {
        status: 400,
      });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(categories), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [CATEGORIES_GET] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request, { params }: IStoreId) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name || !billboardId) {
      return new NextResponse("name name or billboardId is required", {
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(category), {
      status: 201,
    });
  } catch (error) {
    console.log("⚠️ ERR [CATEGORIES_POST] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
