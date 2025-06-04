// Banco de dados temporário (simulado)
let produtos = [
  {
    id: 1,
    nome: "Notebook Pro",
    descricao: "Notebook de última geração com 16GB RAM",
    preco: 4599.99,
    estoque: 15,
    imagem: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    nome: "Smartphone Elite",
    descricao: "Câmera tripla de 48MP e bateria de 5000mAh",
    preco: 2899.90,
    estoque: 8,
    imagem: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  }
];

// Elementos do DOM
const formCadastro = document.getElementById('form-cadastro');
const listaProdutos = document.getElementById('lista-produtos');

// Cadastrar produto
formCadastro.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const novoProduto = {
    id: Date.now(),
    nome: document.getElementById('nome').value,
    descricao: document.getElementById('descricao').value,
    preco: parseFloat(document.getElementById('preco').value),
    estoque: parseInt(document.getElementById('estoque').value),
    imagem: document.getElementById('imagem').value || "https://via.placeholder.com/300x200?text=Sem+Imagem"
  };

  produtos.push(novoProduto);
  atualizarListaProdutos();
  formCadastro.reset();
});

// Atualizar lista de produtos
function atualizarListaProdutos() {
  listaProdutos.innerHTML = '';
  
  produtos.forEach(produto => {
    const produtoCard = document.createElement('div');
    produtoCard.className = 'produto-card';
    produtoCard.innerHTML = `
      <div class="produto-imagem" style="background-image: url('${produto.imagem}')"></div>
      <div class="produto-info">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <p class="produto-preco">R$ ${produto.preco.toFixed(2)}</p>
        <p>Estoque: ${produto.estoque}</p>
        <div class="produto-acoes">
          <button onclick="editarEstoque(${produto.id}, 1)"><i class="fas fa-plus"></i></button>
          <button onclick="editarEstoque(${produto.id}, -1)"><i class="fas fa-minus"></i></button>
          <button onclick="removerProduto(${produto.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
    listaProdutos.appendChild(produtoCard);
  });
}

// Editar estoque
function editarEstoque(id, quantidade) {
  const produto = produtos.find(p => p.id === id);
  if (produto) {
    produto.estoque += quantidade;
    if (produto.estoque < 0) produto.estoque = 0;
    atualizarListaProdutos();
  }
}

// Remover produto
function removerProduto(id) {
  if (confirm("Tem certeza que deseja remover este produto?")) {
    produtos = produtos.filter(p => p.id !== id);
    atualizarListaProdutos();
  }
}

// Inicializar
atualizarListaProdutos();