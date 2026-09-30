import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Minus, Plus, Repeat, Sparkles, Users } from "lucide-react";
import { ScrollScene } from "@/components/ScrollScene";
import { PixCheckout } from "@/components/PixCheckout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/alcance")({
  head: () => ({
    meta: [
      { title: "Alcance mais pessoas — THE MIND POWER" },
      {
        name: "description",
        content:
          "Divulgue seu perfil com a @themindpower.br: reposts infinitos por R$30/mês, collab de post por R$60 ou post feito pela página por R$80.",
      },
      { property: "og:title", content: "Alcance mais pessoas — THE MIND POWER" },
      {
        property: "og:description",
        content: "Reposts infinitos, collabs e posts produzidos pela página. Pague no Pix.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Alcance,
});

const DM = "https://ig.me/m/themindpower.br";

type Plan = {
  id: string;
  icon: typeof Repeat;
  name: string;
  price: number;
  unit: string;
  tagline: string;
  perks: string[];
  qty: boolean;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "reposts",
    icon: Repeat,
    name: "Reposts infinitos",
    price: 30,
    unit: "/mês",
    tagline: "Seu conteúdo nos stories da página, sem limite.",
    perks: [
      "Reposts ilimitados por 30 dias",
      "Marcação do seu @ em todos os stories",
      "Prioridade na fila de publicação",
    ],
    qty: false,
  },
  {
    id: "collab",
    icon: Users,
    name: "Collab de post",
    price: 60,
    unit: "/post",
    tagline: "Post publicado em colaboração: aparece nos dois perfis.",
    perks: [
      "Publicação em collab no feed",
      "Alcance somado dos dois públicos",
      "Fica fixo no seu perfil também",
    ],
    qty: true,
    highlight: true,
  },
  {
    id: "producao",
    icon: Sparkles,
    name: "Post feito pela página",
    price: 80,
    unit: "/post",
    tagline: "A gente cria a arte, a legenda e publica no estilo da página.",
    perks: [
      "Criação completa no estilo anime da página",
      "Legenda e hashtags estratégicas",
      "A partir de 4 posts no mesmo mês: reposts infinitos de brinde",
    ],
    qty: true,
  },
];

function Alcance() {
  const [selected, setSelected] = useState<Plan | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({ collab: 1, producao: 1 });

  const amountFor = (p: Plan) => p.price * (p.qty ? (qty[p.id] ?? 1) : 1);

  return (
    <main className="relative min-h-screen px-6 pb-24 pt-8">
      <ScrollScene dim={0.55} />

      <Link
        to="/"
        className="ghost-btn inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
      >
        <ArrowLeft className="size-4" /> Voltar
      </Link>

      <header className="mx-auto mt-10 max-w-sm text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Divulgação</p>
        <h1 className="animate-rise mt-3 text-3xl font-bold leading-tight">
          Alcance <span className="neon-text">mais pessoas</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Escolha como quer aparecer para o público da @themindpower.br. Pagamento no Pix e sua
          divulgação entra na fila no mesmo dia.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-sm gap-5">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`surface-card animate-rise relative rounded-3xl p-6 ${
              plan.highlight ? "shadow-[var(--shadow-neon)]" : ""
            }`}
          >
            {plan.highlight && (
              <span className="neon-btn absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                mais escolhido
              </span>
            )}
            <plan.icon className="size-6 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

            <p className="mt-4 flex items-end gap-1">
              <span className="neon-text text-3xl font-bold">
                R$ {plan.price.toFixed(2).replace(".", ",")}
              </span>
              <span className="pb-1 text-xs text-muted-foreground">{plan.unit}</span>
            </p>

            <ul className="mt-4 space-y-2">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {perk}
                </li>
              ))}
            </ul>

            {plan.qty && (
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Posts
                </span>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Menos"
                    onClick={() =>
                      setQty((q) => ({ ...q, [plan.id]: Math.max(1, (q[plan.id] ?? 1) - 1) }))
                    }
                    className="ghost-btn rounded-full p-1.5"
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-5 text-center text-sm font-semibold">
                    {qty[plan.id] ?? 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Mais"
                    onClick={() =>
                      setQty((q) => ({ ...q, [plan.id]: Math.min(12, (q[plan.id] ?? 1) + 1) }))
                    }
                    className="ghost-btn rounded-full p-1.5"
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={() => setSelected(plan)}
              className="neon-btn mt-5 h-auto w-full rounded-2xl px-5 py-4 text-sm font-semibold"
            >
              Quero esse — R$ {amountFor(plan).toFixed(2).replace(".", ",")}
            </Button>

            {plan.id === "producao" && (qty[plan.id] ?? 1) >= 4 && (
              <p className="mt-3 text-center text-[11px] font-semibold text-accent">
                Você desbloqueou reposts infinitos no mês!
              </p>
            )}
          </article>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-sm text-center text-[11px] leading-relaxed text-muted-foreground">
        Depois do pagamento você é levado direto para a DM do Instagram para enviar o conteúdo e
        combinar as datas.
      </p>

      {selected && (
        <PixCheckout
          open
          onClose={() => setSelected(null)}
          amount={amountFor(selected)}
          label={
            selected.qty
              ? `${selected.name} (${qty[selected.id] ?? 1}x)`
              : selected.name
          }
          description={`THE MIND POWER - ${selected.name}`}
          collectInstagram
          success={{
            title: "Pagamento confirmado!",
            text: "Agora chama na DM do Instagram para enviar seu conteúdo e combinar as datas da divulgação.",
            ctaLabel: "Abrir DM do @themindpower.br",
            ctaHref: DM,
          }}
        />
      )}
    </main>
  );
}
