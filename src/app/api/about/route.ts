import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wait = Number(searchParams.get("wait") || 0);

  await new Promise((resolve) => setTimeout(resolve, wait));

  return NextResponse.json(`waited ${wait} ms`);
}
