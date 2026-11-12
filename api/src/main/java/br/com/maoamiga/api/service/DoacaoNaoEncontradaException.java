package br.com.maoamiga.api.service;

import java.util.UUID;

public class DoacaoNaoEncontradaException extends RuntimeException {

    public DoacaoNaoEncontradaException(UUID id) {
        super("Doação não encontrada com id: " + id);
    }
}
