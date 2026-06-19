import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("upack_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Decode session token
    const decodedStr = Buffer.from(sessionCookie, "base64").toString("utf-8");
    const sessionData = JSON.parse(decodedStr);

    return NextResponse.json({
      authenticated: true,
      user: {
        chatId: sessionData.chatId,
        username: sessionData.username,
        firstName: sessionData.firstName,
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
