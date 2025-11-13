import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

export async function GET() {
  try {
    const allProducts = await db.select().from(products);

    return NextResponse.json({
      success: true,
      data: allProducts,
      count: allProducts.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
