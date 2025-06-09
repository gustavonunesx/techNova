document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM
  const produtosGrid = document.querySelector('.produtos-grid');
  const searchInput = document.querySelector('.search-box input');
  const searchButton = document.querySelector('.search-box button');
  const filterSelect = document.querySelector('.filter-select');
  const paginacao = document.querySelector('.paginacao');
  const modal = document.getElementById('confirmacao-modal');
  const modalConfirmar = document.querySelector('.btn-confirmar');
  const modalCancelar = document.querySelector('.btn-cancelar');
  
  // Variáveis de estado
  let produtos = [];
  let produtosFiltrados = [];
  let produtoParaExcluir = null;
  let paginaAtual = 1;
  const produtosPorPagina = 6;

  // Dados mockados (substituir por API real)
  const mockProdutos = [
    {
      id: 1,
      nome: 'Smartphone Premium',
      descricao: 'Smartphone com tela de 6.5", 128GB de armazenamento e câmera tripla.',
      categoria: 'Eletrônicos',
      preco: 2799.99,
      precoOriginal: null,
      estoque: 15,
      imagem: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      badge: 'Mais Vendido'
    },
    {
      id: 2,
      nome: 'Tênis Esportivo',
      descricao: 'Tênis para corrida com amortecimento e solado antiderrapante.',
      categoria: 'Calçados',
      preco: 349.90,
      precoOriginal: null,
      estoque: 8,
      imagem: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      badge: null
    },
    {
      id: 3,
      nome: 'Smart TV 55" 4K',
      descricao: 'TV inteligente com resolução 4K, HDR e sistema operacional integrado.',
      categoria: 'Eletrônicos',
      preco: 3599.00,
      precoOriginal: null,
      estoque: 5,
      imagem: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      badge: 'Novidade'
    },
    {
      id: 4,
      nome: 'Cafeteira Premium',
      descricao: 'Cafeteira automática com moedor integrado e preparo programável.',
      categoria: 'Eletrodomésticos',
      preco: 899.00,
      precoOriginal: null,
      estoque: 12,
      imagem: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      badge: null
    },
    {
      id: 5,
      nome: 'Relógio Inteligente',
      descricao: 'Monitor de atividades físicas, notificações e resistente à água.',
      categoria: 'Acessórios',
      preco: 399.90,
      precoOriginal: 499.90,
      estoque: 7,
      imagem: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      badge: 'Promoção'
    },
    {
      id: 6,
      nome: 'Tênis de Corrida',
      descricao: 'Leve e confortável para corridas de longa distância.',
      categoria: 'Calçados',
      preco: 279.90,
      precoOriginal: null,
      estoque: 10,
      imagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      badge: null
    },
    {
      id: 7,
      nome: 'Fone de Ouvido Bluetooth',
      descricao: 'Cancelamento de ruído e 30h de bateria.',
      categoria: 'Eletrônicos',
      preco: 599.90,
      precoOriginal: null,
      estoque: 9,
      imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      badge: null
    },
    {
      id: 8,
      nome: 'Mochila para Notebook',
      descricao: 'Resistente à água com compartimento acolchoado para notebook.',
      categoria: 'Acessórios',
      preco: 199.90,
      precoOriginal: 249.90,
      estoque: 14,
      imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      badge: 'Promoção'
    }
  ];

  // Inicialização
  function init() {
    carregarProdutos();
    setupEventListeners();
  }

  // Carregar produtos (mockado - substituir por chamada API)
  function carregarProdutos() {
    // Simular carregamento assíncrono
    setTimeout(() => {
      produtos = mockProdutos;
      filtrarProdutos();
    }, 500);
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Busca
    // @ts-ignore
    searchButton.addEventListener('click', filtrarProdutos);
    // @ts-ignore
    searchInput.addEventListener('keyup', function(e) {
      // @ts-ignore
      if (e.key === 'Enter') filtrarProdutos();
    });

    // Filtro por categoria
    // @ts-ignore
    filterSelect.addEventListener('change', function() {
      paginaAtual = 1;
      filtrarProdutos();
    });

    // Modal
    // @ts-ignore
    modalCancelar.addEventListener('click', fecharModal);
    // @ts-ignore
    modalConfirmar.addEventListener('click', confirmarExclusao);

    // Logout
    // @ts-ignore
    document.querySelector('.btn-logout').addEventListener('click', function() {
      // Implementar lógica de logout
      alert('Logout realizado com sucesso!');
    });
  }

  // Filtrar produtos por busca e categoria
  function filtrarProdutos() {
    // @ts-ignore
    const termoBusca = searchInput.value.toLowerCase();
    // @ts-ignore
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

    // @ts-ignore
    produtosGrid.innerHTML = '';

    if (produtosPagina.length === 0) {
      // @ts-ignore
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
      // @ts-ignore
      produtosGrid.appendChild(produtoCard);
    });
  }

  // Criar card de produto
  function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.dataset.id = produto.id;

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

    // Adicionar event listeners aos botões
    // @ts-ignore
    card.querySelector('.btn-editar').addEventListener('click', () => editarProduto(produto.id));
    // @ts-ignore
    card.querySelector('.btn-excluir').addEventListener('click', () => abrirModalExclusao(produto.id));

    return card;
  }

  // Atualizar controles de paginação
  function atualizarPaginacao() {
    const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
    
    // @ts-ignore
    paginacao.innerHTML = '';
    
    if (totalPaginas <= 1) return;
    
    // Botão anterior
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
    // @ts-ignore
    paginacao.appendChild(btnAnterior);
    
    // Números das páginas
    for (let i = 1; i <= totalPaginas; i++) {
      const btnPagina = document.createElement('button');
      btnPagina.className = `pagina-btn ${i === paginaAtual ? 'active' : ''}`;
      // @ts-ignore
      btnPagina.textContent = i;
      btnPagina.addEventListener('click', () => {
        paginaAtual = i;
        renderizarProdutos();
      });
      // @ts-ignore
      paginacao.appendChild(btnPagina);
    }
    
    // Botão próximo
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
    // @ts-ignore
    paginacao.appendChild(btnProximo);
  }

  // Abrir modal de confirmação de exclusão
  function abrirModalExclusao(produtoId) {
    produtoParaExcluir = produtoId;
    // @ts-ignore
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Fechar modal
  function fecharModal() {
    // @ts-ignore
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    produtoParaExcluir = null;
  }

  // Confirmar exclusão de produto
  function confirmarExclusao() {
    if (!produtoParaExcluir) {
      fecharModal();
      return;
    }
    
    // Simular exclusão (substituir por chamada API)
    setTimeout(() => {
      produtos = produtos.filter(p => p.id !== produtoParaExcluir);
      mostrarMensagem('Produto excluído com sucesso!', 'success');
      filtrarProdutos();
      fecharModal();
    }, 800);
  }

  // Editar produto (redireciona para página de edição)
  function editarProduto(produtoId) {
    // Simular redirecionamento para página de edição
    console.log(`Redirecionando para edição do produto ${produtoId}`);
    // window.location.href = `/editar-produto.html?id=${produtoId}`;
    mostrarMensagem(`Editando produto ID: ${produtoId}`, 'info');
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