import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createPixCharge, checkPixCharge } from "@/lib/mistic.functions";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  amount: number;
  label: string;
  description: string;
  /** Conteúdo mostrado depois do pagamento confirmado */
  success: { title: string; text: string; ctaLabel: string; ctaHref: string };
  collectInstagram?: boolean;
  autoStart?: boolean;
};

const HIDDEN_DOCUMENT = "77777777777";

export function PixCheckout({
  open,
  onClose,
  amount,
  label,
  description,
  success,
  collectInstagram = false,
  autoStart = false,
}: Props) {
  const create = useServerFn(createPixCharge);
  const check = useServerFn(checkPixCharge);

  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [pix, setPix] = useState<{ pixCode: string | null; transactionId: string } | null>(null);
  const [paid, setPaid] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setPix(null);
      setPaid(false);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!pix || paid) return;
    timer.current = setInterval(async () => {
      try {
        const r = await check({ data: { transactionId: pix.transactionId } });
        if (r.paid) setPaid(true);
      } catch {
        /* segue tentando */
      }
    }, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [pix, paid, check]);

  const generatePix = useCallback(async (instagramUser?: string) => {
    setLoading(true);
    try {
      const cleanInstagram = instagramUser?.trim().replace(/^@/, "");
      const r = await create({
        data: {
          amount,
          description,
          payerName: cleanInstagram ? `@${cleanInstagram}` : "THE MIND POWER",
          payerDocument: HIDDEN_DOCUMENT,
        },
      });
      setPix({ pixCode: r.pixCode, transactionId: r.transactionId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível gerar o Pix.");
    } finally {
      setLoading(false);
    }
  }, [amount, create, description]);

  useEffect(() => {
    if (open && autoStart && !pix && !loading && !paid) void generatePix();
  }, [autoStart, generatePix, loading, open, paid, pix]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void generatePix(instagram);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 backdrop-blur-sm">
      <div className="surface-card animate-rise max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl p-6 pb-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pagamento Pix</p>
            <h2 className="mt-1 text-lg font-semibold">{label}</h2>
            <p className="neon-text mt-1 text-2xl font-bold">
              R$ {amount.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar"
            className="ghost-btn rounded-full p-2 text-muted-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        {paid ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full neon-btn">
              <Check className="size-7" />
            </div>
            <h3 className="text-lg font-semibold">{success.title}</h3>
            <p className="text-sm text-muted-foreground">{success.text}</p>
            <a
              href={success.ctaHref}
              target="_blank"
              rel="noreferrer"
              className="neon-btn block rounded-2xl px-5 py-4 text-center text-sm font-semibold"
            >
              {success.ctaLabel}
            </a>
          </div>
        ) : pix ? (
          <div className="space-y-4">
            {pix.pixCode ? (
              <>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=440x440&margin=12&data=${encodeURIComponent(
                    pix.pixCode,
                  )}`}
                  alt="QR Code Pix"
                  width={220}
                  height={220}
                  loading="lazy"
                  className="mx-auto rounded-2xl border border-border bg-foreground p-2"
                />
                <p className="break-all rounded-xl bg-secondary/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
                  {pix.pixCode}
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    if (pix.pixCode) void navigator.clipboard.writeText(pix.pixCode);
                    toast.success("Código Pix copiado!");
                  }}
                  className="neon-btn flex h-auto w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold"
                >
                  <Copy className="size-4" /> Copiar código Pix
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Cobrança criada. Se o código não aparecer, fale com a gente na DM do Instagram.
              </p>
            )}
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> Aguardando a confirmação do pagamento…
            </p>
          </div>
        ) : loading ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="size-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Criando seu QR Code Pix…</p>
          </div>
        ) : collectInstagram ? (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
                Seu Instagram
              </label>
              <input
                required
                minLength={2}
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@seuusuario"
                className="w-full rounded-xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:border-ring"
              />
            </div>
            <Button
              type="submit"
              disabled={instagram.trim().replace(/^@/, "").length < 2}
              className="neon-btn flex h-auto w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold disabled:opacity-60"
            >
              Gerar Pix
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Pagamento processado com segurança via Pix.
            </p>
          </form>
        ) : null}
      </div>
    </div>
  );
}
