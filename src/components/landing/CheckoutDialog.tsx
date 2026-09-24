import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, Copy, Instagram, Loader2, Minus, Plus, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { checkPixCharge, createPixCharge } from "@/lib/misticpay.functions";
import type { Plan } from "@/lib/plans";

type Charge = {
  transactionId: string;
  qrCodeBase64: string | null;
  qrcodeUrl: string | null;
  copyPaste: string | null;
  amount: number;
};

export function CheckoutDialog({
  plan,
  onOpenChange,
}: {
  plan: Plan | null;
  onOpenChange: (open: boolean) => void;
}) {
  const createCharge = useServerFn(createPixCharge);
  const checkCharge = useServerFn(checkPixCharge);

  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [charge, setCharge] = useState<Charge | null>(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!plan) {
      setHandle("");
      setCharge(null);
      setPaid(false);
      setLoading(false);
      setQuantity(1);
    }
  }, [plan]);

  useEffect(() => {
    if (!charge || paid) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await checkCharge({ data: { transactionId: charge.transactionId } });
        if (res.paid) {
          setPaid(true);
          toast.success("Pagamento confirmado!");
        }
      } catch {
        /* silencioso: segue tentando */
      }
    }, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [charge, paid, checkCharge]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!plan) return;
    setLoading(true);
    try {
      const res = await createCharge({
        data: {
          planId: plan.id,
          quantity,
          handle,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setCharge({
        transactionId: res.transactionId,
        qrCodeBase64: res.qrCodeBase64,
        qrcodeUrl: res.qrcodeUrl,
        copyPaste: res.copyPaste,
        amount: res.amount,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível gerar o Pix.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!charge?.copyPaste) return;
    await navigator.clipboard.writeText(charge.copyPaste);
    setCopied(true);
    toast.success("Código Pix copiado.");
    setTimeout(() => setCopied(false), 2000);
  }

  const qrSrc = charge?.qrCodeBase64 ?? charge?.qrcodeUrl ?? null;
  const total = plan ? plan.price * quantity : 0;

  return (
    <Dialog open={Boolean(plan)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">
            {paid ? "Tudo certo." : plan?.name}
          </DialogTitle>
          <DialogDescription>
            {paid
              ? "Recebemos seu pagamento. Em breve entramos em contato pelo seu @."
              : charge
                ? `Pague R$${charge.amount} via Pix para confirmar.`
                : "Informe o @ da sua página para gerar o Pix."}
          </DialogDescription>
        </DialogHeader>

        {paid ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check className="size-8" />
            </div>
            <div className="text-center">
              <p className="font-medium">Agora envie seus posts pela nossa DM.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Mande o material para @themindpower.br e informe o mesmo @ usado na compra.
              </p>
            </div>
            <Button asChild className="w-full">
              <a href="https://ig.me/m/themindpower.br" target="_blank" rel="noreferrer">
                <Instagram />
                Enviar posts pela DM
              </a>
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
              Fechar
            </Button>
          </div>
        ) : charge ? (
          <div className="flex flex-col gap-4">
            <div className="mx-auto rounded-xl bg-white p-3">
              {qrSrc ? (
                <img src={qrSrc} alt="QR Code Pix" className="size-56" />
              ) : (
                <QrCode className="size-56 text-black" />
              )}
            </div>
            {charge.copyPaste ? (
              <>
                <p className="break-all rounded-md bg-secondary/60 p-3 text-xs text-muted-foreground">
                  {charge.copyPaste}
                </p>
                <Button variant="secondary" onClick={copyCode} className="w-full">
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied ? "Copiado" : "Copiar código Pix"}
                </Button>
              </>
            ) : null}
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Aguardando confirmação do pagamento…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {plan && plan.maxQuantity > 1 ? (
              <div className="quantity-panel">
                <div>
                  <p className="rule-label">Quantidade de {plan.quantityLabel}s</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    R${plan.price} por {plan.quantityLabel}
                  </p>
                </div>
                <div className="quantity-stepper" aria-label={`Quantidade de ${plan.quantityLabel}s`}>
                  <Button type="button" size="icon" variant="ghost" aria-label="Diminuir quantidade" disabled={quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                    <Minus />
                  </Button>
                  <output className="quantity-value" aria-live="polite">{quantity}</output>
                  <Button type="button" size="icon" variant="ghost" aria-label="Aumentar quantidade" disabled={quantity >= plan.maxQuantity} onClick={() => setQuantity((current) => Math.min(plan.maxQuantity, current + 1))}>
                    <Plus />
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <label htmlFor="handle" className="rule-label">
                Seu @ do Instagram
              </label>
              <Input
                id="handle"
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                placeholder="@suapagina"
                autoComplete="off"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Gerar Pix de R${total.toLocaleString("pt-BR")}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Pagamento processado via Pix. Nada além do seu @ é necessário.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
