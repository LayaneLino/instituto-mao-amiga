package br.com.maoamiga.api.config;

import br.com.maoamiga.api.ponto.ParametroInvalidoException;
import br.com.maoamiga.api.ponto.PontoNaoEncontradoException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TratamentoDeErros {

    @ExceptionHandler(PontoNaoEncontradoException.class)
    public ResponseEntity<ProblemDetail> naoEncontrado(PontoNaoEncontradoException ex) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problema.setTitle("Ponto não encontrado");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problema);
    }

    @ExceptionHandler(ParametroInvalidoException.class)
    public ResponseEntity<ProblemDetail> parametroInvalido(ParametroInvalidoException ex) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problema.setTitle("Parâmetro inválido");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problema);
    }
}
