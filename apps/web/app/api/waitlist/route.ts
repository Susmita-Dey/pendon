import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, feedback } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("DISCORD_WEBHOOK_URL is not set. Simulating success for development.");
      return NextResponse.json({ success: true, simulated: true });
    }

    // Format the discord message
    let message = `🎉 **New Waitlist Signup!**\n**Email:** \`${email}\``;
    if (feedback) {
      message += `\n**What they want to build:**\n> ${feedback}`;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
