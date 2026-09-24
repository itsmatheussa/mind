import { createServerFn } from "@tanstack/react-start";

const API_BASE = "https://api.misticpay.com/api";

/** CPF fixo usado para validar o pagamento quando o cliente informa apenas o @. */
const DEFAULT_PAYER_DOCUMENT = "77777777777";

type CreateInput = {
  planId: string;
  quantity: number;
  handle: string;
};

const CATALOG = {
  reps: { name: "Reps Infinitas", unitPrice: 30, maxQuantity: 1 },
  collab: { name: "Posts em Collab", unitPrice: 60, maxQuantity: 5 },
  content: { name: "Post criado para você", unitPrice: 80, maxQuantity: 20 },
} as const;

function credentials() {
  const ci = process.env["MISTICPAY_CLIENT_ID"];
  const cs = process.env["WOOCOMMERCE_CONSUMER_SECRET"];
  if (!ci || !cs) throw new Error("Credenciais da MisticPay não configuradas.");
  return { ci, cs };
}

function normalizeHandle(raw: string) {
  const handle = raw.trim().replace(/^@+/, "").slice(0, 40);
  return handle;
}

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((input: CreateInput) => {
    const handle = normalizeHandle(String(input?.handle ?? ""));
    if (handle.length < 2) throw new Error("Informe o @ da sua página.");
    const planId = String(input?.planId ?? "") as keyof typeof CATALOG;
    const plan = CATALOG[planId];
    if (!plan) throw new Error("Plano inválido.");
    const quantity = Math.floor(Number(input?.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > plan.maxQuantity) {
      throw new Error("Quantidade inválida.");
    }
    return {
      planId,
      planName: plan.name,
      quantity,
      amount: plan.unitPrice * quantity,
      handle,
    };
  })
  .handler(async ({ data }) => {
    const { ci, cs } = credentials();
    const transactionId = `${data.planId}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const res = await fetch(`${API_BASE}/transactions/create`, {
      method: "POST",
      headers: { ci, cs, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: data.amount,
        payerName: `@${data.handle}`,
        payerDocument: DEFAULT_PAYER_DOCUMENT,
        transactionId,
        description: `${data.quantity}x ${data.planName} — @${data.handle}`,
      }),
    });

    const json = (await res.json().catch(() => null)) as
      | { message?: string; data?: Record<string, unknown> }
      | null;

    if (!res.ok || !json?.data) {
      console.error("MisticPay create failed", res.status, json);
      return { ok: false as const, error: "Não foi possível gerar o Pix agora." };
    }

    const d = json.data as Record<string, string | number>;
    return {
      ok: true as const,
      transactionId: String(d["transactionId"] ?? transactionId),
      qrCodeBase64: (d["qrCodeBase64"] as string | undefined) ?? null,
      qrcodeUrl: (d["qrcodeUrl"] as string | undefined) ?? null,
      copyPaste: (d["copyPaste"] as string | undefined) ?? null,
      amount: data.amount,
    };
  });

export const checkPixCharge = createServerFn({ method: "POST" })
  .inputValidator((input: { transactionId: string }) => ({
    transactionId: String(input?.transactionId ?? ""),
  }))
  .handler(async ({ data }) => {
    if (!data.transactionId) return { ok: false as const, paid: false };
    const { ci, cs } = credentials();

    const res = await fetch(`${API_BASE}/transactions/check`, {
      method: "POST",
      headers: { ci, cs, "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId: data.transactionId }),
    });

    const json = (await res.json().catch(() => null)) as
      | { data?: Record<string, unknown> }
      | null;

    if (!res.ok || !json) return { ok: false as const, paid: false };

    const state = String(
      (json.data?.["transactionState"] as string | undefined) ??
        (json.data?.["status"] as string | undefined) ??
        "",
    ).toUpperCase();

    const paid = ["COMPLETO", "PAGO", "APROVADO", "COMPLETED", "PAID"].includes(state);
    return { ok: true as const, paid, state };
  });
