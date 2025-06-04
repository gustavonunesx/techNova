package com.senai.hackaton.DTO;

import lombok.Data;
import java.util.List;

@Data
public class ProdutoInputDTO {
    private String nome;
    private String textoDescritivo;
    private String cor;
    private String fabricante;
    private double preco;
    private int quantidade;
    private List<String> imagens;
}