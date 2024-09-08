// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({});
  return NextResponse.json(session);
}
