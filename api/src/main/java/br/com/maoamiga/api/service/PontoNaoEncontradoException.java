package br.com.maoamiga.api.service;

import java.util.UUID;

public class PontoNaoEncontradoException extends RuntimeException {

    public PontoNaoEncontradoException(UUID id) {
        super("Ponto não encontrado com id: " + id);
    }
}
