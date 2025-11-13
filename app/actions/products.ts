"use server";

import apiClient from "@/lib/axios";

export async function getAllProducts() {
  try {
    const { data: result } = await apiClient.get("/api/products");

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch products");
    }

    return result.data;
  } catch (error) {
    console.error("Error in getAllProducts action:", error);
    throw error;
  }
}
