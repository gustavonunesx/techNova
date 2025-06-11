// /js/api.js
const API_BASE_URL = 'http://localhost:8080'; // Porta padrão do Spring Boot

const axios = window.axios;
axios.defaults.baseURL = API_BASE_URL;
let imagemData = [];

// --- Serviço de Produtos ---
const ProdutoService = {
  /**
   * Busca todos os produtos
   * @returns {Promise<Array>} Lista de produtos
   */
  getAll: async () => {
  try {
    const response = await axios.get('/produtos/get');
    return response.data.map(item => {
      let imagem = 'https://via.placeholder.com/300'; // Fallback
      let descricao = item.textoDescritivo || 'Sem descrição';

      if (item.textoDescritivo) {
        const [desc, img] = item.textoDescritivo.split(' - ');
        if (img) {
          descricao = desc || descricao;
          imagem = img;
          console.log(`Imagem mapeada de textoDescritivo: ${img}`); // Depuração
        }
      }

      if (item.urlImagem) {
        imagem = item.urlImagem;
        console.log(`Imagem mapeada de urlImagem: ${item.urlImagem}`); // Depuração
      }

      if (item.imagens && Array.isArray(item.imagens) && item.imagens.length > 0) {
        imagem = item.imagens[0];
        console.log(`Imagem mapeada de imagens: ${item.imagens[0]}`); // Depuração
      }

      return {
        id: item.idProduto,
        nome: item.nome || 'Produto sem nome',
        descricao: descricao,
        categoria: item.fabricante || 'Sem categoria',
        preco: item.preco || 0,
        estoque: item.quantidade || 0,
        imagem: imagemData.map(img => img.src),
        cor: item.cor || null
      };
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
},

  /**
   * Exclui um produto
   * @param {number} id - ID do produto
   */
  delete: async (id) => {
    await axios.delete(`/produtos/delete/${id}`); // Ajustado para /produtos/delete/{id}
  },

  /**
   * Cria/atualiza um produto (exemplo)
   * @param {Object} produto - Dados do produto
   */
  save: async (produto) => {
    const method = produto.id ? 'put' : 'post';
    const url = produto.id ? `/produtos/put/${produto.id}` : '/produtos/post';
    return await axios[method](url, {
      nome: produto.nome,
      textoDescritivo: `${produto.descricao} - ${produto.imagem}`, // Ajustar formato
      fabricante: produto.categoria,
      preco: produto.preco,
      quantidade: produto.estoque,
      cor: produto.cor || null
    });
  }
};

// --- Serviço de Autenticação (exemplo) ---
const AuthService = {
  login: async (credenciais) => {
    const response = await axios.post('/auth/login', credenciais);
    return response.data;
  }
};

// Exportar para uso global
window.ApiService = { ProdutoService, AuthService };