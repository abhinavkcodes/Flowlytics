import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { syncUserGithubData } from "@/lib/github/sync";
import { getGithubAccessToken } from "@/lib/auth-helpers";

function verifySignature(payload: string, signatureHeader: string | null): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifySignature(payload, signature)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  const body = JSON.parse(payload) as {
    repository?: { full_name?: string };
    sender?: { login?: string };
  };

  logger.info("GitHub webhook received", { event, repo: body.repository?.full_name });

  if (event === "push" || event === "pull_request") {
    const senderLogin = body.sender?.login;
    if (senderLogin) {
      const user = await prisma.user.findUnique({ where: { username: senderLogin } });
      if (user) {
        const token = await getGithubAccessToken(user.id);
        if (token) {
          syncUserGithubData(user.id, token).catch((err) =>
            logger.error("Webhook sync failed", { userId: user.id, err: String(err) })
          );
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}