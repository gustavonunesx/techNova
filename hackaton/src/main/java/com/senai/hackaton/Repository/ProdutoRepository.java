package com.senai.hackaton.Repository;

import com.senai.hackaton.Entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByNomeContaining(String nome);
    List<Produto> findByFabricante(String fabricante);
    List<Produto> findByCor(String cor);
}