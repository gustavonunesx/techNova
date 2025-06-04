// script-principal.js
document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar produtos
    function carregarProdutos() {
        return JSON.parse(localStorage.getItem('produtos')) || [];
    }

    // Função para salvar produtos
    function salvarProdutos(produtos) {
        localStorage.setItem('produtos', JSON.stringify(produtos));
    }

    // Função para formatar preço
    function formatarPreco(preco) {
        return preco.toFixed(2).replace('.', ',');
    }

    // Função para renderizar produtos em destaque
    function renderizarDestaque() {
        const container = document.getElementById('destaque-container');
        if (!container) return;
        
        // Produtos em destaque (exemplo fixo)
        const produtosDestaque = [
            {
                id: 1,
                nome: "Gabinete Gamer Acóspelo M345",
                categoria: "GABINETES",
                descricao: "Acusarium M345, 8A-16a-Tower, Lateral de Vidro, Preto, AC-AQUADRAM M345-BK",
                precoAtual: 389.99,
                precoAnterior: 459.99,
                imagem: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                tag: "OFERTA"
            },
            {
                id: 2,
                nome: "Pichau Kit Upgrade AMD Ryzen",
                categoria: "COMPONENTES",
                descricao: "2.7DX003, B55MA Avant Elite DDR4",
                precoAtual: 1389.99,
                precoAnterior: null,
                imagem: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                tag: "LANÇAMENTO"
            },
            {
                id: 3,
                nome: "Monitor Gamer Pichau Central",
                categoria: "MONITORES",
                descricao: "Pujara 27, 2ª Pol, PS 165Hz, Tms, FreeSync, HBMWDR PC CBRLS27-RL01",
                precoAtual: 1899.99,
                precoAnterior: 2299.99,
                imagem: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                tag: "DESTAQUE"
            },
            {
                id: 4,
                nome: "Processador AMD Ryzen 7",
                categoria: "PROCESSADORES",
                descricao: "980X000, 8-Cmo, 16-Threads, 4.78Hz (5.28Hz Turbo), Cache 10MB",
                precoAtual: 1599.99,
                precoAnterior: 1899.99,
                imagem: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                tag: "OFERTA"
            }
        ];

        container.innerHTML = produtosDestaque.map(produto => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    ${produto.tag ? `<span class="product-tag">${produto.tag}</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${produto.categoria}</div>
                    <h3 class="product-name">${produto.nome}</h3>
                    <p class="product-description">${produto.descricao}</p>
                    <div class="product-price">
                        <div class="current-price">R$ ${formatarPreco(produto.precoAtual)}</div>
                        ${produto.precoAnterior ? `
                            <div class="old-price">R$ ${formatarPreco(produto.precoAnterior)}</div>
                            <div class="discount">${Math.round(100 - (produto.precoAtual / produto.precoAnterior * 100))}% OFF</div>
                        ` : ''}
                    </div>
                    <div class="installments">em até 12x de R$ ${formatarPreco(produto.precoAtual / 12)} sem juros</div>
                    <div class="product-actions">
                        <button class="cart-btn">Adicionar ao Carrinho</button>
                        <button class="wishlist-btn"><i class="fas fa-heart"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Função para renderizar produtos cadastrados
    function renderizarProdutosCadastrados(produtos) {
        const container = document.getElementById('produtos-container');
        const mensagemVazio = document.getElementById('mensagem-vazio');
        const filtroContainer = document.getElementById('filtro-container');
        
        if (produtos.length === 0) {
            container.innerHTML = '';
            mensagemVazio.style.display = 'block';
            filtroContainer.style.display = 'none';
            return;
        }
        
        mensagemVazio.style.display = 'none';
        filtroContainer.style.display = 'flex';
        
        container.innerHTML = produtos.map(produto => `
            <div class="product-card" data-id="${produto.id}">
                <div class="product-image">
                    <img src="${produto.imagens[0] || 'https://via.placeholder.com/200'}" alt="${produto.nome}">
                </div>
                <div class="product-info">
                    <div class="product-category">${produto.fabricante}</div>
                    <h3 class="product-name">${produto.nome}</h3>
                    <p class="product-description">${produto.textoDescritivo}</p>
                    <div class="product-price">
                        <div class="current-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div class="product-details">
                        <p><strong>Cor:</strong> ${produto.cor}</p>
                        <p><strong>Fabricante:</strong> ${produto.fabricante}</p>
                        <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
                    </div>
                    <div class="produto-acoes">
                        <button class="btn-acao btn-estoque" data-id="${produto.id}">
                            <i class="fas fa-boxes"></i> Estoque
                        </button>
                        <button class="btn-acao btn-editar" data-id="${produto.id}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-acao btn-excluir" data-id="${produto.id}">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Adicionar eventos aos botões de ação
        document.querySelectorAll('.btn-estoque').forEach(btn => {
            btn.addEventListener('click', function() {
                const produtoId = this.getAttribute('data-id');
                abrirModalEstoque(produtoId);
            });
        });
        
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const produtoId = this.getAttribute('data-id');
                window.location.href = `cadastro.html?id=${produtoId}`;
            });
        });
        
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const produtoId = this.getAttribute('data-id');
                excluirProduto(produtoId);
            });
        });
    }

    // Função para abrir modal de estoque
    function abrirModalEstoque(produtoId) {
        const produtos = carregarProdutos();
        const produto = produtos.find(p => p.id == produtoId);
        
        if (produto) {
            document.getElementById('modal-produto-nome').textContent = produto.nome;
            document.getElementById('modal-estoque-atual').textContent = produto.quantidade;
            document.getElementById('estoque-modal').style.display = 'block';
            
            // Atualizar evento do botão de atualizar estoque
            const btnAtualizar = document.getElementById('btn-atualizar-estoque');
            btnAtualizar.onclick = function() {
                atualizarEstoque(produtoId);
            };
        }
    }

    // Função para atualizar estoque
    function atualizarEstoque(produtoId) {
        const operacao = document.getElementById('estoque-operacao').value;
        const quantidade = parseInt(document.getElementById('estoque-quantidade').value);
        
        if (isNaN(quantidade) || quantidade <= 0) {
            alert('Por favor, insira uma quantidade válida.');
            return;
        }
        
        const produtos = carregarProdutos();
        const produtoIndex = produtos.findIndex(p => p.id == produtoId);
        
        if (produtoIndex !== -1) {
            switch (operacao) {
                case 'entrada':
                    produtos[produtoIndex].quantidade += quantidade;
                    break;
                case 'saida':
                    if (produtos[produtoIndex].quantidade < quantidade) {
                        alert('Quantidade insuficiente em estoque!');
                        return;
                    }
                    produtos[produtoIndex].quantidade -= quantidade;
                    break;
                case 'ajuste':
                    produtos[produtoIndex].quantidade = quantidade;
                    break;
            }
            
            salvarProdutos(produtos);
            renderizarProdutosCadastrados(produtos);
            document.getElementById('estoque-modal').style.display = 'none';
            alert('Estoque atualizado com sucesso!');
        }
    }

    // Função para excluir produto
    function excluirProduto(produtoId) {
        if (confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
            const produtos = carregarProdutos();
            const novosProdutos = produtos.filter(p => p.id != produtoId);
            salvarProdutos(novosProdutos);
            renderizarProdutosCadastrados(novosProdutos);
        }
    }

    // Função para preencher fabricantes no filtro
    function preencherFabricantes() {
        const produtos = carregarProdutos();
        const fabricantes = [...new Set(produtos.map(p => p.fabricante))];
        const select = document.getElementById('filtro-fabricante');
        
        // Limpar opções existentes (exceto a primeira)
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Adicionar novos fabricantes
        fabricantes.forEach(fabricante => {
            const option = document.createElement('option');
            option.value = fabricante;
            option.textContent = fabricante;
            select.appendChild(option);
        });
    }

    // Função para filtrar produtos
    function filtrarProdutos() {
        const nome = document.getElementById('filtro-nome').value.toLowerCase();
        const fabricante = document.getElementById('filtro-fabricante').value;
        
        const produtos = carregarProdutos();
        const produtosFiltrados = produtos.filter(produto => {
            const atendeNome = produto.nome.toLowerCase().includes(nome);
            const atendeFabricante = fabricante === '' || produto.fabricante === fabricante;
            return atendeNome && atendeFabricante;
        });
        
        renderizarProdutosCadastrados(produtosFiltrados);
    }

    // Navegação suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Evento de fechar modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('estoque-modal').style.display = 'none';
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('estoque-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Inicialização
    renderizarDestaque();
    
    const produtosCadastrados = carregarProdutos();
    renderizarProdutosCadastrados(produtosCadastrados);
    
    // Só preencher filtros se houver produtos
    if (produtosCadastrados.length > 0) {
        preencherFabricantes();
        
        // Evento de filtro
        document.getElementById('btn-filtrar').addEventListener('click', filtrarProdutos);
        document.getElementById('filtro-nome').addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filtrarProdutos();
        });
    }
});