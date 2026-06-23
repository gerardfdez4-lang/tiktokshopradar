import { getRanking } from "../../../lib/echotik.js";
import { SAMPLE_RANKING } from "../../../lib/sample.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "US";
  const date = searchParams.get("date") || undefined;
  const rankField = Number(searchParams.get("rankField") || 1);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 20);

  if (process.env.DEMO_MODE === "1") {
    const items = page === 1 ? SAMPLE_RANKING : [];
    return Response.json({ ok: true, items, demo: true });
  }

  try {
    const items = await getRanking({ region, date, rankField, page, pageSize });
    return Response.json({ ok: true, items });
  } catch (err) {
    return Response.json(
      { ok: false, error: err.message, code: err.code ?? null },
      { status: 502 }
    );
  }
}
