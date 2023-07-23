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
    const {
      name,
      images,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (
      !name ||
      !images ||
      !images.length ||
      !price ||
      !categoryId ||
      !colorId ||
      !sizeId
    ) {
      return new NextResponse("Bad request some missing data input", {
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

    console.log(
      "🚀 ~ file: route.ts:65 ~ ...images.map((image: { url: string }) => image):",
      ...images.map((image: { url: string }) => image)
    );
    const createdProduct = await prismadb.product.create({
      data: {
        name,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(createdProduct), {
      status: 201,
    });
  } catch (error) {
    console.log("⚠️ ERR [PRODUCTS_POST] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;
    // const isArchived = searchParams.get("isArchived") || undefined;

    if (!params.storeId) {
      return new NextResponse("storeId is required", {
        status: 400,
      });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const resp = {
      status_code: 200,
      message: "Success get all products",
      data: products,
    };

    return new NextResponse(JSON.stringify(resp), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [PRODUCTS_GET] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
