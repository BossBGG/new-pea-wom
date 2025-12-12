import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    let swPath: string;

    // Try standalone path first (production)
    const standalonePath = path.join(
      process.cwd(),
      "public",
      "firebase-messaging-sw.js"
    );

    if (fs.existsSync(standalonePath)) {
      swPath = standalonePath;
    } else {
      // Fallback to dev path
      swPath = path.join(process.cwd(), "public", "firebase-messaging-sw.js");
    }

    console.log("[SW Route] Loading from:", swPath);
    const sw = fs.readFileSync(swPath, "utf8");

    return new NextResponse(sw, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Service-Worker-Allowed": "/",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[SW Route] Error loading service worker:", error);
    return new NextResponse(
      `console.error('Service worker not found: ${error}');`,
      {
        status: 404,
        headers: {
          "Content-Type": "application/javascript",
        },
      }
    );
  }
}

export const dynamic = "force-static";
export const revalidate = false;
