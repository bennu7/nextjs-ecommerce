import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface ProductParams {
  params: {
    storeId: string;
    productId: string;
  };
}

export async function GET(req: Request, { params }: ProductParams) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", {
        status: 400,
      });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    const resp = {
      status_code: 200,
      message: "Success get data product by id",
      data: product,
    };

    return new NextResponse(JSON.stringify(resp), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [PRODUCT_GET] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: ProductParams) {
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

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const updatedProduct = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
          // updateMany: {
          //   where: {
          //     productId: params.productId,
          //   },
          //   data: {
          //     url: images.map((image: { url: string }) => image.url),
          //   },
          // },
        },
      },
    });
    console.log(
      "🚀 ~ file: route.ts:109 ~ PATCH ~ updatedProduct:",
      updatedProduct
    );

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.log("⚠️ ERR [PRODUCT_productId_PATCH] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: ProductParams) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", {
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

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return new NextResponse(JSON.stringify(product), {
      status: 200,
    });
  } catch (error) {
    console.log("⚠️ ERR [PRODUCT_DELETE] :", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
