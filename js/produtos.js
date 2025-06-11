document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const produtosGrid = document.querySelector('.produtos-grid');
  const searchInput = document.querySelector('.search-box input');
  const searchButton = document.querySelector('.search-box button');
  const filterSelect = document.querySelector('.filter-select');
  const paginacao = document.querySelector('.paginacao');
  const modal = document.getElementById('confirmacao-modal');
  const modalConfirmar = document.querySelector('.btn-confirmar');
  const modalCancelar = document.querySelector('.btn-cancelar');
  const logoutButton = document.querySelector('.btn-logout');

  // Variáveis de estado
  let produtos = []; // Única declaração de produtos
  let produtosFiltrados = [];
  let produtoParaExcluir = null;
  let paginaAtual = 1;
  const produtosPorPagina = 6;

  // Inicialização
  function init() {
    carregarProdutos();
    setupEventListeners();
  }

  // Carregar produtos via API
  async function carregarProdutos() {
    try {
      produtosGrid.innerHTML = `
        <div class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Carregando produtos...</p>
        </div>
      `;

      produtos = await window.ApiService.ProdutoService.getAll();
      atualizarFiltroCategorias();
      atualizarEstatisticas();
      filtrarProdutos();
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      produtosGrid.innerHTML = `
        <div class="sem-resultados">
          <i class="fas fa-exclamation-circle"></i>
          <p>Erro ao carregar produtos. Tente novamente mais tarde.</p>
        </div>
      `;
    }
  }

  // Configurar event listeners
  function setupEventListeners() {
    searchButton.addEventListener('click', filtrarProdutos);
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') filtrarProdutos();
    });

    filterSelect.addEventListener('change', () => {
      paginaAtual = 1;
      filtrarProdutos();
    });

    modalCancelar.addEventListener('click', fecharModal);
    modalConfirmar.addEventListener('click', confirmarExclusao);

    logoutButton.addEventListener('click', () => {
      alert('Logout realizado com sucesso!');
    });
  }

  // Atualizar filtro de categorias dinamicamente
  function atualizarFiltroCategorias() {
    const categorias = ['Todos', ...new Set(produtos.map(p => p.categoria))];
    filterSelect.innerHTML = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  // Atualizar estatísticas
  function atualizarEstatisticas() {
    const totalProdutos = produtos.length;
    const totalCategorias = new Set(produtos.map(p => p.categoria)).size;
    const valorEstoque = produtos.reduce((sum, p) => sum + (p.preco * p.estoque), 0);

    const statCards = document.querySelectorAll('#inicio .stats .stat-card');
    if (statCards.length >= 3) {
      statCards[0].querySelector('.stat-number').textContent = totalProdutos.toString();
      statCards[1].querySelector('.stat-number').textContent = totalCategorias.toString();
      statCards[2].querySelector('.stat-number').textContent = formatarMoeda(valorEstoque);
    }
  }

  // Filtrar produtos por busca e categoria
  function filtrarProdutos() {
    const termoBusca = searchInput.value.toLowerCase();
    const categoriaSelecionada = filterSelect.value;

    produtosFiltrados = produtos.filter(produto => {
      const matchBusca = produto.nome.toLowerCase().includes(termoBusca) || 
                        produto.descricao.toLowerCase().includes(termoBusca);
      const matchCategoria = categoriaSelecionada === 'Todos' || 
                           produto.categoria === categoriaSelecionada;
      
      return matchBusca && matchCategoria;
    });

    atualizarPaginacao();
    renderizarProdutos();
  }

  // Renderizar produtos na página atual
  function renderizarProdutos() {
    const inicio = (paginaAtual - 1) * produtosPorPagina;
    const fim = inicio + produtosPorPagina;
    const produtosPagina = produtosFiltrados.slice(inicio, fim);

    produtosGrid.innerHTML = '';

    if (produtosPagina.length === 0) {
      produtosGrid.innerHTML = `
        <div class="sem-resultados">
          <i class="fas fa-box-open"></i>
          <p>Nenhum produto encontrado</p>
        </div>
      `;
      return;
    }

    produtosPagina.forEach(produto => {
      const produtoCard = criarCardProduto(produto);
      produtosGrid.appendChild(produtoCard);
    });
  }

  // Criar card de produto
  function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.dataset.id = produto.id.toString();

    let badgeHTML = '';
    if (produto.badge) {
      badgeHTML = `<div class="produto-badge">${produto.badge}</div>`;
    }

    let precoHTML = '';
    if (produto.precoOriginal) {
      precoHTML = `
        <div class="preco-promocional">
          <span class="preco-antigo">${formatarMoeda(produto.precoOriginal)}</span>
          <span class="produto-preco">${formatarMoeda(produto.preco)}</span>
        </div>
      `;
    } else {
      precoHTML = `<p class="produto-preco">${formatarMoeda(produto.preco)}</p>`;
    }

    card.innerHTML = `
      ${badgeHTML}
      <div class="produto-imagem" style="background-image: url('${produto.imagem}');"></div>
      <div class="produto-info">
        <h3>${produto.nome}</h3>
        <p class="produto-descricao">${produto.descricao}</p>
        <div class="produto-meta">
          <span class="produto-categoria">${produto.categoria}</span>
          <span class="produto-estoque"><i class="fas fa-box-open"></i> ${produto.estoque} unidades</span>
        </div>
        ${precoHTML}
        <div class="produto-acoes">
          <button class="btn-editar"><i class="fas fa-edit"></i> Editar</button>
          <button class="btn-excluir"><i class="fas fa-trash-alt"></i> Excluir</button>
        </div>
      </div>
    `;

    card.querySelector('.btn-editar').addEventListener('click', () => editarProduto(produto.id));
    card.querySelector('.btn-excluir').addEventListener('click', () => abrirModalExclusao(produto.id));

    return card;
  }

  // Atualizar controles de paginação
  function atualizarPaginacao() {
    const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
    
    paginacao.innerHTML = '';
    
    if (totalPaginas <= 1) return;
    
    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'pagina-btn';
    btnAnterior.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.addEventListener('click', () => {
      if (paginaAtual > 1) {
        paginaAtual--;
        renderizarProdutos();
      }
    });
    paginacao.appendChild(btnAnterior);
    
    for (let i = 1; i <= totalPaginas; i++) {
      const btnPagina = document.createElement('button');
      btnPagina.className = `pagina-btn ${i === paginaAtual ? 'active' : ''}`;
      btnPagina.textContent = i.toString();
      btnPagina.addEventListener('click', () => {
        paginaAtual = i;
        renderizarProdutos();
      });
      paginacao.appendChild(btnPagina);
    }
    
    const btnProximo = document.createElement('button');
    btnProximo.className = 'pagina-btn';
    btnProximo.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.addEventListener('click', () => {
      if (paginaAtual < totalPaginas) {
        paginaAtual++;
        renderizarProdutos();
      }
    });
    paginacao.appendChild(btnProximo);
  }

  // Abrir modal de confirmação de exclusão
  function abrirModalExclusao(produtoId) {
    produtoParaExcluir = produtoId;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Fechar modal
  function fecharModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    produtoParaExcluir = null;
  }

  // Confirmar exclusão de produto
  async function confirmarExclusao() {
    if (!produtoParaExcluir) {
      fecharModal();
      return;
    }
    
    try {
      await window.ApiService.ProdutoService.delete(produtoParaExcluir);
      produtos = produtos.filter(p => p.id !== produtoParaExcluir);
      mostrarMensagem('Produto excluído com sucesso!', 'success');
      atualizarEstatisticas();
      filtrarProdutos();
      fecharModal();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      mostrarMensagem('Erro ao excluir produto!', 'error');
    }
  }

  // Editar produto (redireciona para página de edição)
  function editarProduto(produtoId) {
    console.log(`Redirecionando para edição do produto ${produtoId}`);
    mostrarMensagem(`Editando produto ID: ${produtoId}`, 'info');
    // window.location.href = `/cadastro.html?id=${produtoId}`; // Ajuste para a página de edição
  }

  // Mostrar mensagem de feedback
  function mostrarMensagem(mensagem, tipo) {
    const tipos = {
      success: { bg: '#00b894', icon: 'check-circle' },
      error: { bg: '#d63031', icon: 'exclamation-circle' },
      info: { bg: '#0984e3', icon: 'info-circle' }
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast-mensagem';
    toast.style.backgroundColor = tipos[tipo].bg;
    toast.innerHTML = `
      <i class="fas fa-${tipos[tipo].icon}"></i>
      <span>${mensagem}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Formatador de moeda
  function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  // Iniciar aplicação
  init();
});