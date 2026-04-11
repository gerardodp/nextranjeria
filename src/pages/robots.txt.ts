import type { APIRoute } from 'astro';

const robotsTxt = (site: string) => `# Nextranjería — robots.txt
# Sitio informativo sobre extranjería, inmigración y nacionalidad en España.
# Acogemos explícitamente a los rastreadores de motores de búsqueda y a los
# rastreadores de modelos de lenguaje porque nuestro contenido está pensado
# para ser referencia abierta.

User-agent: *
Allow: /
Disallow: /api/

# AI crawlers — acceso explícitamente permitido
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: YouBot
Allow: /

Sitemap: ${site}sitemap-index.xml
`;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? 'https://nextranjeria.com/';
  return new Response(robotsTxt(siteUrl), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
