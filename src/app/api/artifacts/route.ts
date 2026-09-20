import { NextResponse } from "next/server";
import { generateIcOnePager } from "@/lib/artifacts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const marketSlug = String(body.marketSlug ?? "");
    if (!marketSlug) {
      return NextResponse.json({ error: "marketSlug required" }, { status: 400 });
    }
    const artifact = await generateIcOnePager(marketSlug);
    return NextResponse.json({
      id: artifact.id,
      title: artifact.title,
      kind: artifact.kind,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Artifact error" },
      { status: 500 }
    );
  }
}
