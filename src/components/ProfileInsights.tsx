import { useEffect, useRef, useState } from "react";
import { Eye, Target, Users } from "lucide-react";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const element = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = element.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const startedAt = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={element} className="neon-text text-2xl font-bold tabular-nums">
      {display.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

function LiveFollowers() {
  const [followers, setFollowers] = useState(100_000);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFollowers((current) => current + Math.ceil(Math.random() * 3));
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="neon-text text-2xl font-bold tabular-nums">
      {followers.toLocaleString("pt-BR")}+
    </span>
  );
}

export function ProfileInsights() {
  const insights = [
    { icon: Users, value: <LiveFollowers />, label: "seguidores em tempo real" },
    { icon: Eye, value: <AnimatedNumber value={4} suffix="M" />, label: "views mensais" },
    { icon: Target, value: <span className="neon-text text-xl font-bold">Público qualificado</span>, label: "alcance que conecta" },
  ];

  return (
    <section aria-labelledby="insights-title" className="relative px-6 pb-12">
      <div className="mx-auto max-w-sm">
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-accent">Insights do canal</p>
        <h2 id="insights-title" className="mt-3 text-center text-2xl font-semibold">Números que falam</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {insights.map((insight, index) => (
            <article
              key={insight.label}
              className={`surface-card flex min-h-36 flex-col justify-between rounded-2xl p-4 ${index === 2 ? "col-span-2" : ""}`}
            >
              <insight.icon className="size-5 text-accent" />
              <div className="mt-5">
                {insight.value}
                <p className="mt-1 text-xs text-muted-foreground">{insight.label}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}