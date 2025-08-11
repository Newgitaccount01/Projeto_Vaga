// main.js
// Script simples para buscar produtos da Amazon e exibir na tela
// Feito para ser fácil de entender e adaptar!

// Espera o formulário de busca ser enviado
// Faz a requisição para o backend e mostra os resultados na tela

document.getElementById('searchForm').addEventListener('submit', async function(e) {
  // Previne o recarregamento da página

  e.preventDefault();
  // Pega o valor digitado pelo usuário
  const keyword = document.getElementById('keyword').value.trim();
  if (!keyword) return;

  // Seleciona a div onde os resultados vão aparecer
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<p>Buscando produtos, aguarde...</p>'; // Mensagem temporária

  try {
    // Faz a requisição para o backend
    // Faz a requisição para o backend (Express)
    const response = await fetch(`http://localhost:3001/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const products = await response.json();

    // Se não achou nada, mostra mensagem amigável
    if (!Array.isArray(products) || products.length === 0) {
      resultsDiv.innerHTML = '<p>Nenhum produto encontrado. Tente outra palavra-chave!</p>';
      return;
    }

    // Monta o HTML dos produtos
    // Monta o HTML dos produtos (cards)
    resultsDiv.innerHTML = products.map(prod => {
      const isValidLink = prod.link && prod.link.startsWith('https://www.amazon.com.br');
      return `
        <div class="product">
          <img src="${prod.img}" alt="Imagem do produto">
          <div class="product-info">
            <div class="product-title">${prod.title}</div>
            <div class="product-price">${prod.price ? 'R$ ' + prod.price : 'Preço indisponível'}</div>
            <div class="product-rating">${prod.rating ? prod.rating + ' estrelas' : 'Sem avaliação'}</div>
            <div class="product-reviews">${prod.reviews ? prod.reviews + ' avaliações' : 'Sem avaliações'}</div>
            ${isValidLink ? `<a class="product-link" href="${prod.link}" target="_blank" rel="noopener noreferrer">Ver na Amazon</a>` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    // Se der erro, mostra mensagem vermelha na tela
    resultsDiv.innerHTML = '<p style="color:red">Erro ao buscar produtos. Tente novamente mais tarde.</p>';
  }
});
