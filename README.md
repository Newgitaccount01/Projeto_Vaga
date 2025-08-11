# Amazon Scraper - Projeto Simples

Esse projeto foi feito para facilitar a busca de produtos na Amazon Brasil de forma rápida e visual. Ele traz os principais dados da primeira página de resultados, direto para uma interface simples e fácil de usar.

## Como funciona?
- Você digita uma palavra-chave (ex: notebook, celular, livro...)
- O sistema busca os produtos na Amazon e mostra: título, preço, avaliações, imagem.

## Tecnologias usadas
- **Backend:** Bun + Express + Axios + JSDOM
- **Frontend:** Vite + HTML + CSS + JS puro

---

## Como rodar o projeto

### 1. Pré-requisitos
- Node.js NÃO é necessário, mas você precisa ter o [Bun](https://bun.sh/) instalado (é rapidinho!)
- Recomendo usar o terminal do próprio Windows (PowerShell)

### 2. Rodando o backend
Abra o terminal e vá até a pasta do backend:
```sh
cd "caminho para a pasta do backend"
bun install
bun run index.ts
```
O backend vai rodar em http://localhost:3001

### 3. Rodando o frontend
Abra outro terminal e vá para a pasta do frontend:
```sh
cd "caminho para a pasta do frontend"
bun install
bun run dev
```
O frontend vai abrir em http://localhost:5173

### 4. Usando
- Acesse http://localhost:5173 no navegador
- Digite o que quiser buscar e clique em "Buscar"


---

## Observações importantes
- O scraping depende do layout da Amazon. Se eles mudarem muita coisa, pode ser que precise ajustar os seletores no backend.
- O sistema só pega a primeira página de resultados.
- O projeto é didático, feito para ser simples de entender e mexer.




