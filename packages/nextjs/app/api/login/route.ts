import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { userData } = await req.json();
    const privateKey = process.env.PRIVATE_KEY!;

    const jwtToken = jwt.sign(
      {
        sub: userData?.fid.toString(),
        name: userData?.displayName,
        username: userData?.username,
        profileImage: userData?.pfpUrl,
        custody: userData?.custody,
        aud: "w3a:farcaster-server",
        iss: "https://web3auth.io",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      privateKey,
      { algorithm: "RS256", keyid: "02e626b5-600c-48c3-a812-2ff0edd8f12f" },
    );

    return NextResponse.json({ token: jwtToken });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
