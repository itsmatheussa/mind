export type Plan = {
  id: "reps" | "collab" | "content";
  index: string;
  kicker: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  priceNote: string;
  highlight: string;
  cta: string;
  featured?: boolean;
  badge?: string;
  maxQuantity: number;
  quantityLabel: string;
};

export const PLANS: Plan[] = [
  {
    id: "reps",
    index: "01",
    kicker: "Reposts",
    name: "Reps Infinitas",
    description:
      "Publique seu conteúdo e tenha acesso a reposts durante todo o mês.",
    price: 30,
    priceLabel: "R$30",
    priceNote: "por mês",
    highlight: "Reposts ilimitados durante o mês.",
    cta: "Quero Reps Infinitas",
    maxQuantity: 1,
    quantityLabel: "assinatura mensal",
  },
  {
    id: "collab",
    index: "02",
    kicker: "Collab",
    name: "Posts em Collab",
    description:
      "Coloque seu conteúdo diretamente em posts colaborativos e alcance uma audiência maior.",
    price: 60,
    priceLabel: "R$60",
    priceNote: "por collab",
    highlight: "Apenas 5 vagas disponíveis por dia.",
    cta: "Reservar Collab",
    maxQuantity: 5,
    quantityLabel: "collab",
  },
  {
    id: "content",
    index: "03",
    kicker: "Content",
    name: "Post criado para você",
    description:
      "Não quer criar o conteúdo? Nós criamos o post para sua página e você ainda recebe as repostagens incluídas conforme a quantidade contratada.",
    price: 80,
    priceLabel: "R$80",
    priceNote: "por post",
    highlight: "Pegou 7+ posts → recebe as reps junto.",
    cta: "Quero meu post",
    featured: true,
    badge: "Mais completo",
    maxQuantity: 20,
    quantityLabel: "post",
  },
];

/** Vagas de collab restantes hoje — ajuste manualmente conforme as reservas. */
export const COLLAB_SLOTS_TOTAL = 5;
export const COLLAB_SLOTS_LEFT = 5;
