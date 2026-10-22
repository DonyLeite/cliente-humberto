# Clínica ESTOU BEM — landing page

Landing page de conversão para a **Clínica ESTOU BEM** (Dr. Humberto, responsável médico).
Site estático, sem framework, sem build obrigatório em produção e com carregamento rápido.

🔗 **Publicação:** <https://donyleite.github.io/cliente-humberto/>
📞 **Contato do projeto:** DZ Marketing Digital

---

## 1. O que a página faz

| Recurso | Como foi implementado |
| --- | --- |
| **Agendamento** | Botão que abre o **Google Calendar** com o evento já preenchido (especialidade, data/hora em UTC, endereço, fuso `America/Sao_Paulo`). Modal mostra os próximos horários livres calculados no fuso de Brasília. |
| **WhatsApp** | Botão flutuante + CTAs secundários, todos com mensagem pré-preenchida vinda de `assets/config.js`. |
| **Assistente virtual** | **Um** chat local (sem backend) com respostas rápidas, botões de atalho e encaminhamento para o WhatsApp. |
| **Status de funcionamento** | Barra no topo atualiza sozinha: "Aberto agora · até 18h00 (BRT)" ou "Fechado agora · abre amanhã às 08h00". |
| **Especialidades** | 10 cards com imagem própria, descrição e atalho de agendamento já com a especialidade selecionada. |
| **Confiança** | CRM/RQE, nota, anos de experiência, pacientes atendidos, depoimentos e FAQ (também em `FAQPage` do Google). |
| **Mobile** | Menu hambúrguer, barra fixa de ação (agendar + WhatsApp) e alvo de toque grande. |

### Fuso horário (importante)

Tudo na página usa **America/Sao_Paulo (BRT, UTC−3)**. O Brasil não tem horário de verão desde 2019,
então o offset é fixo: `hora BRT + 3h = UTC`. O link do Google Agenda recebe o `dates` em **UTC**
(`YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ`) — é esse detalhe que evita a consulta cair 3 horas fora.

---

## 2. Decisões de mercado aplicadas

A página foi construída a partir de boas práticas de landing pages do segmento médico/clínicas:

1. **Um CTA dominante** ("Agendar consulta") repetido no hero, meio de página, contato e fim da página;
   o WhatsApp aparece sempre como alternativa, nunca competindo com o CTA principal.
2. **Prova de credibilidade acima da dobra** — nota, CRM/RQE, volume de pacientes e tempo de experiência
   já no primeiro scroll, para reduzir a desconfiança de quem chega via busca.
3. **Objection handling** — FAQ responde as 8 objeções clássicas (valor, convênio, documentos,children,
   horário, remarcação, demora, localização) antes do contato.
4. **Redução de atrito** — agendamento em 3 passos e no botão que a pessoa já conhece (Google Calendar),
   sem formulário, sem cadastro, sem espera.
5. **Urgência contextual** — "próximo horário livre" e status aberto/fechado fazem a página responder
   "dá pra ir hoje?" sem o visitante precisar abrir o telefone.
6. **Velocidade** — HTML/CSS/JS estáticos, CSS de 31 KB, zero webfonts, zero framework, ilustrações SVG
   de ~2 KB, imagens com `width/height` e `loading="lazy"`.
7. **SEO técnico** — meta/OG tags, `canonical`, `robots.txt`, `sitemap.xml`, manifest PWA,
   JSON-LD `MedicalClinic` + `FAQPage`, hierarquia semântica e âncoras por seção.
8. **Acessibilidade e confiança** — skip link, foco visível, `aria-*` nos modais, contraste alto,
   link de mapa e telefone clicáveis no mobile.

---

## 3. Estrutura

```
.
├─ index.html                 # página completa (markup, JSON-LD, modais)
├─ assets/
│  ├─ styles.css              # Tailwind compilado (commitado — não precisa build)
│  ├─ app.js                  # BRT, agenda, chat, modal, menu, reveal
│  ├─ config.js               # ⭐ TODO o conteúdo editável da clínica
│  └─ img/                    # ilustrações SVG + favicon + ícones PWA
├─ src/input.css              # fonte do Tailwind (para rebuild)
├─ tools/gen-svgs.mjs         # gerador das ilustrações
├─ tailwind.config.js         # tema (teal/coral/slate) + animações
├─ manifest.json
├─ robots.txt
└─ sitemap.xml
```

---

## 4. ⚠️ Checklist antes de publicar

Tudo abaixo está marcado com `TROCAR` em `assets/config.js` (e em alguns trechos de `index.html`).

- [ ] **WhatsApp/telefone**: `clinic.phoneE164` (só números, com `55`) e `clinic.phoneLabel`
- [ ] **Endereço completo**: `clinic.address`, `addressExtra`, `zip`, `neighborhood`
- [ ] **Link do Google Agenda da clínica**: `booking.appointmentUrl`
- [ ] **CRM e RQE** do Dr. Humberto: `clinic.crm`, `clinic.rqe`
- [ ] **E-mail e Instagram**: `clinic.email`, `clinic.instagram`
- [ ] **Nota e nº de avaliações reais**: `socialProof.rating`, `ratingCount`
- [ ] **Nº de pacientes e anos de experiência**: `socialProof.patients`, `years`
- [ ] **CNPJ** no rodapé (`index.html`, busca por `data-cnpj`)
- [ ] **Endereço do site** no `canonical`, no Open Graph e no `sitemap.xml`/`robots.txt`
- [ ] **Textos dos depoimentos** (`index.html`, seção `#avaliacoes`) — usar avaliações reais do Google
- [ ] **Nome da cidade/bairro** citados no FAQ e na seção de contato
- [ ] **Lista de convênios** aceita (se quiser, no FAQ e no chat)
- [ ] **Política de privacidade / LGPD** (link no rodapé) e consentimento de cookies, se houver analytics
- [ ] **Fotos reais**: colocar os `.jpg` em `assets/img/` e ligar `clinic.useRealPhotos: true` (seção 5)

> Enquanto o WhatsApp não for trocado, os links apontam para `5511900000000` (número fictício).

---

## 5. Trocar as ilustrações por fotos reais

As ilustrações em SVG são placeholders consistentes com a marca. Para usar fotos reais:

1. Salve a foto em `assets/img/` **com o mesmo nome** do SVG correspondente (mesmo basename, extensão `.jpg`):
   - `hero.jpg` → `assets/img/hero.svg`
   - `dr-humberto.jpg` → `assets/img/dr-humberto.svg`
   - `esp-clinica-medica.jpg`, `esp-dermatologia.jpg`, `esp-cardiologia.jpg`, `esp-ortopedia.jpg`,
     `esp-neurologia.jpg`, `esp-pediatria.jpg`, `esp-endocrinologia.jpg`, `esp-nutricao.jpg`,
     `esp-ginecologia.jpg`, `esp-urologia.jpg`
2. Em `assets/config.js`, troque `clinic.useRealPhotos: false` para **`true`**.
   A página passa a usar as fotos `.jpg` automaticamente — **sem mexer no HTML**.
   (O atributo `data-photo` de cada `<img>` já aponta para o arquivo correspondente;
   se um SVG falhar, o JS ainda cai para a foto como rede de segurança.)
3. Recomendações: 4:3 para as especialidades (640×480), 3:4 para o hero (960×1080), JPEG < 200 KB,
   `object-cover` já corta mantendo o foco.
4. **Direitos de imagem**: use banco licensed (Unsplash/Pexels) ou fotos próprias — evite material de
   terceiros sem autorização.

---

## 6. Rodar localmente

Abrir `index.html` direto no navegador já funciona (o chat, a agenda e o status funcionam em `file://`).

Para simular o domínio (recomendado, especialmente para manifest e links do Google):

```bash
npx --yes serve .
# abre http://localhost:3000
```

ou

```bash
python -m http.server 8080
```

---

## 7. Rebuild (só se mexer no estilo)

```bash
# 1. instalar/baixar o Tailwind (uma única vez)
npx --yes tailwindcss@3.4.17 -c tailwind.config.js -i src/input.css -o assets/styles.css --minify

# 2. regerar as ilustrações SVG
node tools/gen-svgs.mjs
```

`assets/styles.css` já está commitado — **o site publicado não precisa de nenhum build**.

---

## 8. Deploy

**GitHub Pages (já configurado)**

```bash
git add -A
git commit -m "..."
git push origin main
# Settings → Pages → Source: main / root
```

**Netlify / Vercel / Cloudflare Pages**

- Build command: *(vazio)* · Publish directory: `/` (raiz)
- Não é necessário passo de build — o CSS já está compilado.

**Domínio próprio (estoubem.com.br)**

1. Aponte o DNS (CNAME/A) para o GitHub Pages, Vercel ou Cloudflare.
2. Troque `https://estoubem.com.br` por `https://SEUDOMINIO.com.br` em:
   `index.html` (canonical, OG, JSON-LD), `robots.txt` e `sitemap.xml`.
3. Reenvie o `sitemap.xml` no Google Search Console.

**Depois de publicar**

- [ ] Testar o link do WhatsApp num celular
- [ ] Testar o agendamento no Google Agenda (celular e desktop)
- [ ] Validação do Schema.org no Rich Results Test
- [ ] Criar/verificar o perfil no Google Business Profile (a maior fonte de tráfego orgânico de clínica)
- [ ] Plausible/GA4 só depois do consentimento (LGPD)

---

## 9. Sobre o assistente virtual

O chat (`assets/app.js`) é um motor de intenção **local, sem backend**:

- Reconhece: especialidades, horários, preço, convênio, endereço, documentos, médico e contato.
- Responde com dados reais vindos de `assets/config.js` (endereço, próximos horários, CRM).
- Oferece atalhos (botões) e sempre oferece saída para o WhatsApp/recepção.

Para trocar por IA (ChatGPT/Gemini/n8n/Make):

1. Substitua a função `interpret()` + as respostas em `handleAction()` por uma chamada a um endpoint.
2. Mantenha a regra: **nunca dar diagnóstico nem valor de consulta pelo bot** — encaminhar para a recepção.
3. Use as variáveis de `config.js` no system prompt (endereço, horários, CRM) para evitar divergência.

---

## 10. Licença e créditos

Código e ilustrações: uso livre para o cliente. Layout, copy e estratégia: **DZ Marketing Digital**.
