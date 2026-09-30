import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, FolderOpen, Smartphone } from "lucide-react";
import { ScrollScene } from "@/components/ScrollScene";
import { PixCheckout } from "@/components/PixCheckout";
import { Button } from "@/components/ui/button";
import wallpaper1 from "@/assets/wallpaper-1.png.asset.json";
import wallpaper2 from "@/assets/wallpaper-2.png.asset.json";
import wallpaper3 from "@/assets/wallpaper-3.png.asset.json";
import wallpaper4 from "@/assets/wallpaper-4.png.asset.json";

export const Route = createFileRoute("/wallpapers")({
  head: () => ({
    meta: [
      { title: "Pacote de wallpapers anime — THE MIND POWER" },
      {
        name: "description",
        content:
          "Leve todos os wallpapers anime de mentalidade da @themindpower.br por R$ 4,99 e receba o acesso à pasta completa.",
      },
      { property: "og:title", content: "Pacote de wallpapers anime — THE MIND POWER" },
      {
        property: "og:description",
        content: "Vários wallpapers de uma vez por R$ 4,99, com acesso imediato à pasta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wallpapers,
});

const DRIVE =
  "https://drive.google.com/drive/folders/1WebDmZnRcaXsujI2nQFHnR7HopO5ZD4u?usp=sharing";

function Wallpapers() {
  const [open, setOpen] = useState(false);

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
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Pacote completo</p>
        <h1 className="animate-rise mt-3 text-3xl font-bold leading-tight">
          Wallpapers <span className="neon-text">anime</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Todos os wallpapers da página em um único pacote. Pague R$ 4,99 e receba na hora o acesso à
          pasta com todos os arquivos em alta qualidade.
        </p>
      </header>

      <div className="animate-rise mx-auto mt-8 grid w-full max-w-sm grid-cols-2 gap-2 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-neon)]">
        {[wallpaper1, wallpaper2, wallpaper3, wallpaper4].map((wallpaper, index) => (
          <img
            key={wallpaper.asset_id}
            src={wallpaper.url}
            alt={`Wallpaper anime ${index + 1}`}
            width={index === 3 ? 795 : 658}
            height={index === 3 ? 842 : 845}
            loading="lazy"
            className="aspect-[3/4] w-full rounded-lg object-cover"
          />
        ))}
      </div>

      <div className="surface-card mx-auto mt-8 max-w-sm rounded-3xl p-6">
        <p className="flex items-end gap-1">
          <span className="neon-text text-4xl font-bold">R$ 4,99</span>
          <span className="pb-1.5 text-xs text-muted-foreground">pagamento único</span>
        </p>
        <ul className="mt-5 space-y-2">
          {[
            "Vários wallpapers de uma vez, sem assinatura",
            "Formato vertical otimizado para celular",
            "Acesso imediato à pasta com todos os arquivos",
            "Novos wallpapers adicionados à mesma pasta",
          ].map((perk) => (
            <li key={perk} className="flex gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" />
              {perk}
            </li>
          ))}
        </ul>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="neon-btn mt-6 flex h-auto w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold"
        >
          <FolderOpen className="size-4" /> Adquirir por R$ 4,99
        </Button>
        <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Smartphone className="size-3.5" /> Baixe direto no celular depois do Pix
        </p>
      </div>

      <PixCheckout
        open={open}
        onClose={() => setOpen(false)}
        amount={4.99}
        label="Pacote de wallpapers"
        description="THE MIND POWER - Pacote de wallpapers"
        autoStart
        success={{
          title: "Tudo liberado!",
          text: "Seu pagamento foi confirmado. Abra a pasta abaixo para baixar todos os wallpapers.",
          ctaLabel: "Abrir pasta dos wallpapers",
          ctaHref: DRIVE,
        }}
      />
    </main>
  );
}
