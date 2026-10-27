package br.com.maoamiga.api.ponto;

public class PontoNaoEncontradoException extends RuntimeException {

    public PontoNaoEncontradoException(Long id) {
        super("Ponto de coleta " + id + " não encontrado.");
    }
}
