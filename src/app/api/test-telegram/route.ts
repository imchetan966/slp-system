import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  await sendTelegramMessage("🚀 Telegram test from SLP system");

  return NextResponse.json({ success: true });
}