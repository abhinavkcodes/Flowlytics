import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, init);
}

export function apiError(code: string, message: string, status = 400, details?: unknown) {
  const body: ApiResponse<never> = {
    success: false,
    error: { code, message, details },
  };
  return NextResponse.json(body, { status });
}

export async function requireUserId(): Promise<{ userId: string } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { userId: session.user.id };
}