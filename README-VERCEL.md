# Publicação no Vercel

1. Extraia este ZIP e envie a pasta para um repositório Git.
2. Importe o repositório no Vercel.
3. Use **Framework Preset: Other**.
4. Use **Install Command: `bun install`**.
5. Use **Build Command: `bun run build`**.
6. Nas variáveis de ambiente do Vercel, adicione `WOOCOMMERCE_CONSUMER_SECRET` em Production e Preview.

O Client ID da Mistic Pay já está configurado no projeto. A credencial secreta nunca deve ser colocada em código público.

A autenticação legada ci/cs da Mistic Pay tem desligamento previsto para 30/09/2026. Confirme a migração para as credenciais atuais antes de publicar.
