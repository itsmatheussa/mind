import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ImageDown, Instagram, Sparkles, TrendingUp } from "lucide-react";
import { ScrollScene } from "@/components/ScrollScene";
import { ProfileInsights } from "@/components/ProfileInsights";
import avatar from "@/assets/profile.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THE MIND POWER — mentalidade, disciplina e alcance" },
      {
        name: "description",
        content:
          "Links oficiais da @themindpower.br: divulgação para crescer no Instagram e wallpapers anime de mentalidade.",
      },
      { property: "og:title", content: "THE MIND POWER — links oficiais" },
      {
        property: "og:description",
        content: "Alcance mais pessoas com a página e leve pacotes de wallpapers anime.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Bio,
});

const INSTAGRAM = "https://www.instagram.com/themindpower.br/";

function Bio() {
  return (
    <main className="relative min-h-screen">
      <ScrollScene />

      <section className="flex min-h-[92vh] flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
        <img
          src={avatar.url}
          alt="THE MIND POWER"
          width={816}
          height={816}
          className="size-28 rounded-full border border-border object-cover shadow-[var(--shadow-neon)]"
        />
        <h1 className="animate-rise mt-6 text-3xl font-bold leading-tight">
          THE <span className="neon-text">MIND POWER</span>
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-accent">@themindpower.br</p>
        <p className="animate-rise mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Conteúdo diário para quem decidiu mudar a
          própria história e para você crescer junto com a página.
        </p>

        <div className="mt-9 flex w-full max-w-sm flex-col gap-4">
          <Link
            to="/alcance"
            className="neon-btn flex items-center justify-between gap-3 rounded-2xl px-6 py-5 text-left"
          >
            <span>
              <span className="flex items-center gap-2 text-base font-semibold">
                <TrendingUp className="size-5" /> Alcance mais pessoas
              </span>
              <span className="mt-1 block text-xs opacity-80">
                Reposts, collabs e posts feitos pela página
              </span>
            </span>
            <ArrowUpRight className="size-5 shrink-0" />
          </Link>

          <Link
            to="/wallpapers"
            className="ghost-btn flex items-center justify-between gap-3 rounded-2xl px-6 py-5 text-left"
          >
            <span>
              <span className="flex items-center gap-2 text-base font-semibold">
                <ImageDown className="size-5 text-accent" /> Wallpapers
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Pacote completo por R$ 4,99
              </span>
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-muted-foreground" />
          </Link>

          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="ghost-btn flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-medium"
          >
            <Instagram className="size-4" /> Seguir no Instagram
          </a>
        </div>

        <p className="mt-10 animate-pulse-glow text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          role para ver mais
        </p>
      </section>

      <ProfileInsights />

      <section className="relative px-6 pb-24">
        <div className="mx-auto grid max-w-sm gap-4">
          {[
            {
              icon: Sparkles,
              title: "Conteúdo que conecta",
              text: "Frases, cortes e edições anime sobre mentalidade, disciplina e evolução pessoal.",
            },
            {
              icon: TrendingUp,
              title: "Comunidade em crescimento",
              text: "Um público engajado que compartilha, salva e leva a mensagem adiante todos os dias.",
            },
            {
              icon: ImageDown,
              title: "Arte para o seu dia",
              text: "Wallpapers exclusivos para manter o foco na tela do celular.",
            },
          ].map((item) => (
            <article key={item.title} className="surface-card rounded-2xl p-5 text-left">
              <item.icon className="size-5 text-accent" />
              <h2 className="mt-3 text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-12 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} THE MIND POWER
        </p>
      </section>
    </main>
  );
}
