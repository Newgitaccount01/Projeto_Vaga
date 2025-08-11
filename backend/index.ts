// index.ts
// Backend simples para scraping de produtos da Amazon
// Feito para ser fácil de entender e mexer!

// Importa as libs principais
// express: servidor HTTP
// axios: para fazer requisições HTTP simulando navegador
// jsdom: para manipular o HTML da Amazon como se fosse um DOM do navegador

import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express(); // Cria o app Express
const PORT = 3001; // Porta padrão do backend

// Middleware para liberar o acesso do frontend (CORS)
// Assim o navegador não bloqueia as requisições AJAX
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Endpoint principal: recebe uma palavra-chave e retorna os produtos da Amazon
app.get("/api/scrape", async (req, res) => {
  // Recebe a palavra-chave da query string
  const keyword = req.query.keyword as string;
  if (!keyword) {
    // Se não vier nada, retorna erro amigável
    return res.status(400).json({ error: "Por favor, envie uma palavra-chave (?keyword=...)" });
  }

  try {
    // Monta a URL da busca na Amazon Brasil
    const searchUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    // Faz a requisição simulando um navegador (user-agent)
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    // Usa o JSDOM para "navegar" pelo HTML como se fosse o browser
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const products: any[] = []; // Array para guardar os produtos

    // Seleciona todos os produtos da primeira página
    // Usa seletor alternativo para ser mais tolerante a mudanças
    const items = document.querySelectorAll("div.s-main-slot div[data-component-type='s-search-result']");
    items.forEach((el) => {
      // Tenta pegar o título do produto
      let title = el.querySelector("h2 a span")?.textContent?.trim() || "";
      if (!title) title = el.querySelector("h2 span")?.textContent?.trim() || "";

      // Pega o número de estrelas (rating)
      let rating = el.querySelector("span.a-icon-alt")?.textContent?.split(" ")[0] || "";
      // Pega o número de avaliações (reviews)
      let reviews = el.querySelector("span[aria-label*='avaliação']")?.textContent?.replace(/[^\d]/g, "") || "";
      if (!reviews) reviews = el.querySelector("span[aria-label*='avaliac']")?.textContent?.replace(/[^\d]/g, "") || "";

      // Pega a URL da imagem
      let img = el.querySelector("img.s-image")?.getAttribute("src") || "";
      if (!img) img = el.querySelector("img")?.getAttribute("src") || "";

      // Pega o preço (pode estar em diferentes spans, por isso tenta alguns)
      let price = el.querySelector("span.a-price-whole")?.textContent?.replace(/\D/g, "") || "";
      let priceFrac = el.querySelector("span.a-price-fraction")?.textContent?.replace(/\D/g, "") || "";
      if (price) price = price + (priceFrac ? "," + priceFrac : "");
      else price = el.querySelector("span.a-offscreen")?.textContent?.replace(/R\$\s?/g, "") || "";

      // Pega o link do produto
      let link = el.querySelector("h2 a")?.getAttribute("href") || "";
      // Pega o link do produto (href do título)
      // Corrige links relativos que começam com '/'
      if (link && !link.startsWith("http") && link.startsWith("/")) {
        link = `https://www.amazon.com.br${link}`;
      }
      // Se não for um link válido, zera
      if (!link || !link.startsWith("http")) link = '';

      // Só adiciona se tiver título e imagem
      if (title && img) {
        products.push({ title, rating, reviews, img, price, link });
      }
    });

    // Log simples para debug no terminal
    console.log(`[Scraper] Produtos encontrados: ${products.length}`);
    // Retorna os produtos como JSON para o frontend
    res.json(products);
  } catch (err) {
    // Se der erro em qualquer etapa, retorna mensagem amigável
    res.status(500).json({ error: "Erro ao buscar dados da Amazon.", details: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
