import { getProductDetail } from "../../../../lib/echotik.js";
import { sampleDetail } from "../../../../lib/sample.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params;

  if (process.env.DEMO_MODE === "1") {
    return Response.json({ ok: true, product: sampleDetail(id), demo: true });
  }

  try {
    const product = await getProductDetail(id);
    if (!product) {
      return Response.json({ ok: false, error: "No encontrado" }, { status: 404 });
    }
    return Response.json({ ok: true, product });
  } catch (err) {
    return Response.json(
      { ok: false, error: err.message, code: err.code ?? null },
      { status: 502 }
    );
  }
}
