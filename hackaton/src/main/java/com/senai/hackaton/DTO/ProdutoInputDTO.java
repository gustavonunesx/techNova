package com.senai.hackaton.DTO;

import lombok.Data;

@Data
public class ProdutoInputDTO {
    private String nome;
    private double preco;
    private Long quantidade;
}