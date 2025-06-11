package com.senai.hackaton.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduto;

    private String nome;
    private String textoDescritivo;
    private String cor;
    private String fabricante;
    private double preco;
    private int quantidade;

    @ElementCollection
    private List<String> imagens;
}