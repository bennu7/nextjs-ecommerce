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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(sizes), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [SIZES_GET] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request, { params }: IStoreId) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name || !value) {
      return new NextResponse("name name or value is required", {
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

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(size), {
      status: 201,
    });
  } catch (error) {
    console.log("⚠️ ERR [SIZES_POST] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
