package com.senai.hackaton.Controller;

import com.senai.hackaton.DTO.ProdutoInputDTO;
import com.senai.hackaton.DTO.ProdutoOutputDTO;
import com.senai.hackaton.Service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping("/post")
    public ResponseEntity<ProdutoOutputDTO> criarProduto(@RequestBody ProdutoInputDTO produtoInputDTO) {
        ProdutoOutputDTO novoProduto = produtoService.criarProduto(produtoInputDTO);
        return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
    }
    @PostMapping("/{id}/imagens")
    public ResponseEntity<ProdutoOutputDTO> adicionarImagens(
            @PathVariable Long id,
            @RequestBody List<String> novasImagens) {
        ProdutoOutputDTO produtoAtualizado = produtoService.adicionarImagens(id, novasImagens);
        return ResponseEntity.ok(produtoAtualizado);
    }
    @GetMapping("/get")
    public ResponseEntity<List<ProdutoOutputDTO>> listarTodosProdutos() {
        List<ProdutoOutputDTO> produtos = produtoService.buscarTodosProdutos();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ProdutoOutputDTO> buscarProdutoPorId(@PathVariable Long id) {
        ProdutoOutputDTO produto = produtoService.buscarProdutoPorId(id);
        return produto != null ? ResponseEntity.ok(produto) : ResponseEntity.notFound().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProdutoOutputDTO>> buscarProdutosPorNome(@RequestParam String nome) {
        List<ProdutoOutputDTO> produtos = produtoService.buscarProdutosPorNome(nome);
        return ResponseEntity.ok(produtos);
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<ProdutoOutputDTO> atualizarProduto(
            @PathVariable Long id,
            @RequestBody ProdutoInputDTO produtoInputDTO) {
        ProdutoOutputDTO produtoAtualizado = produtoService.atualizarProduto(id, produtoInputDTO);
        return produtoAtualizado != null ? ResponseEntity.ok(produtoAtualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> excluirProduto(@PathVariable Long id) {
        boolean excluido = produtoService.excluirProduto(id);
        return excluido ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}