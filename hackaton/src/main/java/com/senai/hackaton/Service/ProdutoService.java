package com.senai.hackaton.Service;

import com.senai.hackaton.DTO.ProdutoInputDTO;
import com.senai.hackaton.DTO.ProdutoOutputDTO;
import com.senai.hackaton.Entity.Produto;
import com.senai.hackaton.Repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    private ProdutoOutputDTO convertToDTO(Produto produto) {
        ProdutoOutputDTO dto = new ProdutoOutputDTO();
        dto.setIdProduto(produto.getIdProduto());
        dto.setNome(produto.getNome());
        dto.setTextoDescritivo(produto.getTextoDescritivo());
        dto.setCor(produto.getCor());
        dto.setFabricante(produto.getFabricante());
        dto.setPreco(produto.getPreco());
        dto.setQuantidade(produto.getQuantidade());
        dto.setImagens(produto.getImagens());
        return dto;
    }

    private Produto convertToEntity(ProdutoInputDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setTextoDescritivo(dto.getTextoDescritivo());
        produto.setCor(dto.getCor());
        produto.setFabricante(dto.getFabricante());
        produto.setPreco(dto.getPreco());
        produto.setQuantidade(dto.getQuantidade());
        produto.setImagens(dto.getImagens());
        return produto;
    }

    public List<ProdutoOutputDTO> buscarTodosProdutos() {
        return produtoRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProdutoOutputDTO buscarProdutoPorId(Long id) {
        return produtoRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public List<ProdutoOutputDTO> buscarProdutosPorNome(String nome) {
        return produtoRepository.findByNomeContaining(nome)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProdutoOutputDTO criarProduto(ProdutoInputDTO produtoInputDTO) {
        Produto produto = convertToEntity(produtoInputDTO);
        Produto produtoSalvo = produtoRepository.save(produto);
        return convertToDTO(produtoSalvo);
    }

    public ProdutoOutputDTO atualizarProduto(Long id, ProdutoInputDTO produtoInputDTO) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    produto.setNome(produtoInputDTO.getNome());
                    produto.setPreco(produtoInputDTO.getPreco());
                    produto.setQuantidade(produtoInputDTO.getQuantidade());
                    Produto atualizado = produtoRepository.save(produto);
                    return convertToDTO(atualizado);
                })
                .orElse(null);
    }

    public boolean excluirProduto(Long id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public ProdutoOutputDTO adicionarImagens(Long idProduto, List<String> novasImagens) {
        return produtoRepository.findById(idProduto)
                .map(produto -> {
                    List<String> imagensExistentes = produto.getImagens();
                    if (imagensExistentes == null) {
                        produto.setImagens(novasImagens);
                    } else {
                        imagensExistentes.addAll(novasImagens);
                    }
                    Produto produtoAtualizado = produtoRepository.save(produto);
                    return convertToDTO(produtoAtualizado);
                })
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + idProduto));
    }
}