import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Heart, MessageCircle, Play, Send, Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CountUp, Reveal } from "@/components/landing/Reveal";
import { CheckoutDialog } from "@/components/landing/CheckoutDialog";
import { COLLAB_SLOTS_LEFT, COLLAB_SLOTS_TOTAL, PLANS, type Plan } from "@/lib/plans";

import heroImg from "@/assets/hero.jpg";
import card1 from "@/assets/card-1.jpg";
import card2 from "@/assets/card-2.jpg";
import card3 from "@/assets/card-3.jpg";

const TITLE = "themindpower.br — Dê mais alcance para o que você cria";
const DESCRIPTION =
  "Reposts, collabs e posts criados para sua página, distribuídos por uma audiência com mais de 4 milhões de visualizações por mês.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const CARD_IMAGES = [card1, card2, card3];

function Landing() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero onStart={() => setActivePlan(PLANS[2] ?? null)} />
        <StatsBar />
        <Plans onSelect={setActivePlan} />
        <Results />
        <Gallery />
        <Scarcity onSelect={() => setActivePlan(PLANS[1] ?? null)} />
        <ContentOffer onSelect={() => setActivePlan(PLANS[2] ?? null)} />
        <Faq />
        <FinalCta onStart={() => setActivePlan(PLANS[0] ?? null)} />
      </main>
      <Footer />
      <CheckoutDialog
        plan={activePlan}
        onOpenChange={(open) => !open && setActivePlan(null)}
      />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="font-display text-2xl tracking-tight">
          themindpower<span className="text-accent">.br</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#planos" className="transition-colors hover:text-foreground">
            Planos
          </a>
          <a href="#resultados" className="transition-colors hover:text-foreground">
            Resultados
          </a>
          <a href="#feed" className="transition-colors hover:text-foreground">
            Feed
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>
        <Button asChild size="sm">
          <a href="#planos">Começar agora</a>
        </Button>
      </div>
    </header>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section id="top" className="relative grain min-h-[100svh] overflow-hidden anime-hero">
      <img
        src={heroImg}
        alt=""
        width={1536}
        height={1024}
        className="hero-image absolute inset-0 size-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/65 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
      <div className="anime-speed-lines" />
      <div className="grain-layer" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pt-28 pb-20">
        <Reveal>
          <span className="rule-label">Divulgação de páginas</span>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] sm:text-7xl md:text-8xl">
            Dê mais alcance para o que você cria.
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Coloque seus posts na frente de milhares de pessoas através de reposts,
            collabs e conteúdos criados para sua página.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onStart} className="group">
              Começar agora
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#planos">Ver planos</a>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={400}>
          <div className="mt-16 flex items-baseline gap-4 border-t border-border/60 pt-6">
            <span className="font-display text-4xl text-accent sm:text-5xl">
              +<CountUp to={4000000} duration={2200} />
            </span>
            <span className="rule-label">visualizações mensais</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const STATS = [
  { value: 4, suffix: "M", prefix: "+", label: "Visualizações mensais" },
  { value: 100, suffix: "K+", prefix: "", label: "Pessoas alcançadas" },
  { value: 7, suffix: "+", prefix: "", label: "Reposts para desbloquear benefícios" },
  { value: 5, suffix: "", prefix: "", label: "Vagas diárias para collabs" },
];

function StatsBar() {
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border/40 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 90} className="bg-background">
            <div className="px-6 py-12">
              <p className="font-display text-5xl tracking-tight sm:text-6xl">
                {stat.prefix}
                <CountUp to={stat.value} />
                {stat.suffix}
              </p>
              <p className="mt-3 text-sm leading-snug text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Plans({ onSelect }: { onSelect: (plan: Plan) => void }) {
  return (
    <section id="planos" className="mx-auto max-w-6xl px-5 py-28 sm:py-36">
      <Reveal>
        <span className="rule-label">Como funciona</span>
        <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
          Escolha como você quer crescer.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 120}>
            <article
              className={`plan-card group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card p-7 transition-all duration-500 hover:-translate-y-2 ${
                plan.featured ? "ring-1 ring-accent/40" : ""
              }`}
            >
              <img
                src={CARD_IMAGES[i]}
                alt=""
                loading="lazy"
                width={1024}
                height={1024}
                className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.12] transition-all duration-700 group-hover:scale-110 group-hover:opacity-25"
              />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="rule-label">
                    {plan.index} — {plan.kicker}
                  </span>
                  {plan.badge ? (
                    <span className="rounded-full border border-accent/40 px-3 py-1 text-[0.625rem] uppercase tracking-[0.2em] text-accent">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-6 font-display text-3xl transition-transform duration-500 group-hover:-translate-y-0.5">
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="font-display text-5xl">{plan.priceLabel}</span>
                  <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                </div>

                <p className="mt-5 border-l border-accent/50 pl-4 text-sm text-foreground/90">
                  {plan.highlight}
                </p>

                {plan.id === "collab" ? (
                  <div className="mt-6 flex items-center gap-2">
                    {Array.from({ length: COLLAB_SLOTS_TOTAL }).map((_, slot) => (
                      <span
                        key={slot}
                        className={`size-2 rounded-full ${
                          slot < COLLAB_SLOTS_LEFT ? "bg-accent" : "bg-muted"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {COLLAB_SLOTS_LEFT} / {COLLAB_SLOTS_TOTAL} vagas hoje
                    </span>
                  </div>
                ) : null}

                <div className="mt-auto pt-9">
                  <Button
                    onClick={() => onSelect(plan)}
                    variant={plan.featured ? "default" : "secondary"}
                    className="w-full"
                  >
                    {plan.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const RESULT_METRICS = [
  { value: "4.2M+", label: "Views" },
  { value: "98K+", label: "Likes" },
  { value: "12K+", label: "Shares" },
  { value: "8K+", label: "Saves" },
  { value: "540K+", label: "Contas alcançadas" },
];

function Results() {
  return (
    <section id="resultados" className="relative grain overflow-hidden border-y border-border/60">
      <img
        src={card2}
        alt=""
        loading="lazy"
        width={1024}
        height={1024}
        className="absolute inset-0 size-full object-cover opacity-20 edge-fade"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
      <div className="grain-layer" />
      <div className="relative mx-auto max-w-6xl px-5 py-28 sm:py-36">
        <Reveal>
          <span className="rule-label">Resultados</span>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
            Não é promessa. É alcance.
          </h2>
          <p className="mt-6 max-w-lg text-muted-foreground">
            Mais de 4 milhões de visualizações todos os meses.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-5">
          {RESULT_METRICS.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 80}>
              <div className="rounded-xl glass-card px-5 py-8">
                <p className="font-display text-4xl">{metric.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          * Números de exemplo da página. Substitua pelos dados reais antes de publicar.
        </p>
      </div>
    </section>
  );
}

const FEED = [
  { img: card1, views: "1.2M", likes: "42K", comments: "1.1K" },
  { img: card3, views: "860K", likes: "31K", comments: "820" },
  { img: card2, views: "2.4M", likes: "96K", comments: "3.2K" },
  { img: card3, views: "410K", likes: "18K", comments: "540" },
  { img: card1, views: "780K", likes: "27K", comments: "690" },
  { img: card2, views: "1.9M", likes: "74K", comments: "2.4K" },
];

function Gallery() {
  return (
    <section id="feed" className="border-y border-border/60 bg-card/20">
      <div className="mx-auto max-w-6xl px-5 py-28 sm:py-36">
        <Reveal>
          <span className="rule-label">Feed</span>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
            Seu conteúdo. Mais pessoas vendo.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
          {FEED.map((post, i) => (
            <Reveal key={i} delay={i * 70} className={i % 3 === 1 ? "md:translate-y-8" : ""}>
              <article className="group relative overflow-hidden rounded-xl border border-border/60">
                <img
                  src={post.img}
                  alt=""
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Play className="size-3.5" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="size-3.5" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="size-3.5" />
                    {post.comments}
                  </span>
                  <Bookmark className="ml-auto size-3.5" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Scarcity({ onSelect }: { onSelect: () => void }) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-28 text-center sm:py-36">
      <Reveal>
        <span className="rule-label">Collab</span>
        <h2 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">
          Só 5 espaços por dia.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
          Para manter a qualidade e não saturar a audiência, apenas 5 espaços de collab
          ficam disponíveis por dia.
        </p>
      </Reveal>
      <Reveal delay={150}>
        <div className="mt-12 flex items-center justify-center gap-4">
          {Array.from({ length: COLLAB_SLOTS_TOTAL }).map((_, i) => (
            <span
              key={i}
              className={`size-4 rounded-full transition-colors ${
                i < COLLAB_SLOTS_LEFT ? "bg-accent shadow-[0_0_24px_var(--ember)]" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="mt-6 font-display text-2xl">
          {COLLAB_SLOTS_LEFT} / {COLLAB_SLOTS_TOTAL} vagas
        </p>
        <Button size="lg" className="mt-10" onClick={onSelect}>
          Garantir minha vaga
          <ArrowRight className="size-4" />
        </Button>
      </Reveal>
    </section>
  );
}

const STEPS = ["Ideia", "Criação", "Publicação", "Reps"];

function ContentOffer({ onSelect }: { onSelect: () => void }) {
  return (
    <section className="border-y border-border/60">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-28 sm:py-36 md:grid-cols-2 md:items-center">
        <Reveal>
          <span className="rule-label">Content</span>
          <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            Você manda a ideia. A gente transforma em post.
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {STEPS.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="rounded-full border border-border px-4 py-2 text-sm">
                  {step}
                </span>
                {i < STEPS.length - 1 ? (
                  <ArrowRight className="size-4 text-muted-foreground" />
                ) : null}
              </span>
            ))}
          </div>
          <p className="mt-10 font-display text-4xl">R$80 <span className="text-base text-muted-foreground">por post</span></p>
          <p className="mt-3 text-sm text-accent">7+ posts = reps incluídas</p>
          <Button className="mt-10" size="lg" onClick={onSelect}>
            Quero meu post
          </Button>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative grain overflow-hidden rounded-2xl border border-border/60">
            <img
              src={card1}
              alt=""
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full object-cover"
            />
            <div className="grain-layer" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-6">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Heart className="size-3.5" /> 42K
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5" /> 1.1K
                </span>
                <span className="flex items-center gap-1.5">
                  <Send className="size-3.5" /> 7.4K
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "O que são as reps?",
    a: "São as republicações do seu conteúdo na nossa página. Seu post aparece para a audiência que já acompanha a página todos os dias.",
  },
  {
    q: "Quantas pessoas podem contratar por dia?",
    a: "As reps e os posts não têm limite diário. As collabs são limitadas a 5 vagas por dia.",
  },
  {
    q: "Como funciona a collab?",
    a: "Seu perfil entra como colaborador do post, então o conteúdo aparece também no seu feed e leva a audiência da página até você.",
  },
  {
    q: "O que está incluído no post criado?",
    a: "Roteiro, edição e publicação do post no formato ideal para a página, a partir da ideia que você enviar.",
  },
  {
    q: "O que acontece quando pego 7+ posts?",
    a: "A partir de 7 posts contratados, as reps do período entram junto, sem custo adicional.",
  },
  {
    q: "Quando meu conteúdo é publicado?",
    a: "As reps entram na fila do dia seguinte ao pagamento. Posts criados levam alguns dias conforme a fila de produção.",
  },
  {
    q: "Posso escolher o tema do post?",
    a: "Sim. Você envia a ideia, a referência ou o material bruto e adaptamos para o formato da página.",
  },
  {
    q: "Como envio meu conteúdo?",
    a: "Depois do pagamento entramos em contato pelo @ informado e você envia o material por lá.",
  },
];

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-28 sm:py-36">
      <Reveal>
        <span className="rule-label">FAQ</span>
        <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
          Perguntas frequentes.
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

function FinalCta({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative grain overflow-hidden">
      <img
        src={heroImg}
        alt=""
        loading="lazy"
        width={1536}
        height={1024}
        className="absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      <div className="grain-layer" />
      <div className="relative mx-auto max-w-3xl px-5 py-36 text-center sm:py-48">
        <Reveal>
          <h2 className="font-display text-4xl leading-[1.05] sm:text-6xl">
            Seu próximo post pode chegar muito mais longe.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-muted-foreground">
            Escolha como você quer divulgar seu conteúdo e comece a colocar sua página na
            frente de uma audiência que já está assistindo.
          </p>
          <Button size="lg" className="mt-10" onClick={onStart}>
            Começar agora
            <ArrowRight className="size-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 md:flex-row md:items-center md:justify-between">
        <span className="font-display text-2xl">
          themindpower<span className="text-accent">.br</span>
        </span>
        <nav className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
          <a href="#top" className="hover:text-foreground">Início</a>
          <a href="#planos" className="hover:text-foreground">Planos</a>
          <a href="#resultados" className="hover:text-foreground">Resultados</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <a href="#top" className="hover:text-foreground">Termos</a>
          <a href="#top" className="hover:text-foreground">Privacidade</a>
          <a href="#top" className="hover:text-foreground">Contato</a>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} themindpower.br
        </p>
      </div>
    </footer>
  );
}
