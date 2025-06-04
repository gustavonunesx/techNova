document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  
  // Estado da aplicação
  let state = {
    produto: {
      nome: '',
      textoDescritivo: '',
      cor: '',
      fabricante: '',
      preco: '',
      quantidade: '',
      imagens: ['', '', '']
    },
    produtosCadastrados: [],
    mostrarLista: false
  };

  // Função para lidar com o submit do formulário
  function handleSubmit(e) {
    e.preventDefault();
    
    // Atualiza o estado com os valores dos inputs
    updateStateFromForm();
    
    const novoProduto = {
      ...state.produto,
      preco: parseFloat(state.produto.preco),
      quantidade: parseInt(state.produto.quantidade)
    };
    
    state.produtosCadastrados = [...state.produtosCadastrados, novoProduto];
    
    // Reset form
    state.produto = {
      nome: '',
      textoDescritivo: '',
      cor: '',
      fabricante: '',
      preco: '',
      quantidade: '',
      imagens: ['', '', '']
    };
    
    alert('Produto cadastrado com sucesso!');
    render();
  }

  // Alterna a exibição da lista de produtos
  function toggleLista() {
    state.mostrarLista = !state.mostrarLista;
    render();
  }

  // Atualiza o estado com os valores atuais do formulário
  function updateStateFromForm() {
    const form = document.getElementById('produtoForm');
    if (!form) return;
    
    state.produto = {
      nome: form.querySelector('[name="nome"]').value,
      textoDescritivo: form.querySelector('[name="textoDescritivo"]').value,
      cor: form.querySelector('[name="cor"]').value,
      fabricante: form.querySelector('[name="fabricante"]').value,
      preco: form.querySelector('[name="preco"]').value,
      quantidade: form.querySelector('[name="quantidade"]').value,
      imagens: [
        form.querySelector('[name="imagem-0"]').value,
        form.querySelector('[name="imagem-1"]').value,
        form.querySelector('[name="imagem-2"]').value
      ]
    };
  }

  // Adiciona event listeners após o DOM ser renderizado
  function addEventListeners() {
    const form = document.getElementById('produtoForm');
    const toggleBtn = document.getElementById('toggleLista');
    
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleLista);
    }
  }

  // Renderiza a aplicação
  function render() {
    root.innerHTML = `
      <div class="app">
        <h1>TechNova - Cadastro de Produtos</h1>
        
        <form id="produtoForm" class="form-container">
          <div class="form-group">
            <label>Nome do Produto:</label>
            <input
              type="text"
              name="nome"
              value="${state.produto.nome}"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Descrição:</label>
            <textarea
              name="textoDescritivo"
              required
            >${state.produto.textoDescritivo}</textarea>
          </div>
          
          <div class="form-group">
            <label>Cor:</label>
            <input
              type="text"
              name="cor"
              value="${state.produto.cor}"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Fabricante:</label>
            <input
              type="text"
              name="fabricante"
              value="${state.produto.fabricante}"
              required
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Preço (R$):</label>
              <input
                type="number"
                step="0.01"
                name="preco"
                value="${state.produto.preco}"
                required
              />
            </div>
            
            <div class="form-group">
              <label>Quantidade em Estoque:</label>
              <input
                type="number"
                name="quantidade"
                value="${state.produto.quantidade}"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>Imagens (URLs):</label>
            <input
              type="url"
              name="imagem-0"
              value="${state.produto.imagens[0]}"
              placeholder="URL da imagem 1"
            />
            <input
              type="url"
              name="imagem-1"
              value="${state.produto.imagens[1]}"
              placeholder="URL da imagem 2"
            />
            <input
              type="url"
              name="imagem-2"
              value="${state.produto.imagens[2]}"
              placeholder="URL da imagem 3"
            />
          </div>
          
          <button type="submit" class="submit-btn">Cadastrar Produto</button>
        </form>
        
        <div class="lista-container">
          <button id="toggleLista" class="toggle-btn">
            ${state.mostrarLista ? 'Ocultar Produtos Cadastrados' : 'Mostrar Produtos Cadastrados'}
          </button>
          
          ${state.mostrarLista ? `
            <div class="produtos-lista">
              <h2>Produtos Cadastrados (JSON)</h2>
              <pre>${JSON.stringify(state.produtosCadastrados, null, 2)}</pre>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Adiciona os event listeners após renderizar
    addEventListeners();
  }

  // Renderiza a aplicação inicialmente
  render();
});