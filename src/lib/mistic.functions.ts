import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE = "https://api.misticpay.com/api";
const CLIENT_ID = "ci_8idirjrvp5uxsfr";

function headers() {
  const secret = process.env["WOOCOMMERCE_CONSUMER_SECRET"];
  if (!secret) throw new Error("Credencial de pagamento ausente no servidor.");
  return {
    "Content-Type": "application/json",
    ci: CLIENT_ID,
    cs: secret,
  };
}

function pick(obj: unknown, keys: string[]): string | null {
  if (!obj || typeof obj !== "object") return null;
  const rec = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string" && v.length > 0) return v;
    if (typeof v === "number") return String(v);
  }
  for (const v of Object.values(rec)) {
    if (v && typeof v === "object") {
      const found = pick(v, keys);
      if (found) return found;
    }
  }
  return null;
}

const createInput = z.object({
  amount: z.number().positive(),
  description: z.string().min(2).max(120),
  payerName: z.string().min(3).max(80),
  payerDocument: z.string().min(11).max(14),
});

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createInput.parse(data))
  .handler(async ({ data }) => {
    const transactionId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const res = await fetch(`${BASE}/transactions/create`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        amount: data.amount,
        payerName: data.payerName,
        payerDocument: data.payerDocument.replace(/\D/g, ""),
        transactionId,
        description: data.description,
      }),
    });

    const text = await res.text();
    let json: unknown = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      const msg = pick(json, ["message", "error", "detail"]) ?? "Falha ao gerar o Pix.";
      throw new Error(msg);
    }

    const pixCode = pick(json, [
      "pixCode",
      "qrcode",
      "qrCode",
      "copyPaste",
      "copiaecola",
      "brCode",
      "emv",
    ]);
    const id = pick(json, ["transactionId", "id", "transaction_id"]) ?? transactionId;

    return { pixCode, transactionId: id, amount: data.amount };
  });

export const checkPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ transactionId: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const res = await fetch(`${BASE}/transactions/check`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ transactionId: data.transactionId }),
    });
    const text = await res.text();
    let json: unknown = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
    const status = (pick(json, ["status", "state", "situation"]) ?? "PENDING").toUpperCase();
    const paid = ["PAID", "APPROVED", "COMPLETED", "CONFIRMED", "PAGO"].includes(status);
    return { status, paid };
  });
