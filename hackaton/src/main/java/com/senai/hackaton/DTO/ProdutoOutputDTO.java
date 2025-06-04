package com.senai.hackaton.DTO;

import lombok.Data;

@Data
public class ProdutoOutputDTO {
    private Long idProduto;
    private String nome;
    private double preco;
    private Long quantidade;
}