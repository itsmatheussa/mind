# themindpower.br — Landing page para Vercel

Landing page em TanStack Start (React + Vite) com pagamento Pix via MisticPay.

## Subir no Vercel

1. Suba esta pasta em um repositório (GitHub/GitLab) ou use `vercel` CLI.
2. No Vercel, importe o projeto. Framework preset: **Other**.
   - Build Command: `npm run build`
   - Output Directory: deixe em branco (o build já gera `.vercel/output`)
   - Install Command: `npm install`
3. Em **Settings → Environment Variables**, adicione:

| Nome | Valor |
| --- | --- |
| `MISTICPAY_CLIENT_ID` | seu client id da MisticPay (`ci_...`) |
| `WOOCOMMERCE_CONSUMER_SECRET` | seu client secret da MisticPay (`cs_...`) |

4. Deploy.

## Rodando local

```bash
npm install
MISTICPAY_CLIENT_ID=ci_xxx WOOCOMMERCE_CONSUMER_SECRET=cs_xxx npm run dev
```

## Onde editar

- Preços, nomes e textos dos planos: `src/lib/plans.ts`
- Vagas de collab do dia: `COLLAB_SLOTS_LEFT` em `src/lib/plans.ts`
- Textos e seções da página: `src/routes/index.tsx`
- Cores e tipografia: `src/styles.css`
- Integração de pagamento: `src/lib/misticpay.functions.ts`
  (o CPF do pagador é fixo `77777777777`; o cliente informa apenas o @)

Os números de resultados estão marcados como exemplo — substitua pelos dados reais antes de rodar tráfego.
