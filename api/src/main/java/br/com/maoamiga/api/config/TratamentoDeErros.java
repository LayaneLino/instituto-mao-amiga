package br.com.maoamiga.api.config;

import br.com.maoamiga.api.service.DoacaoNaoEncontradaException;
import br.com.maoamiga.api.service.PontoNaoEncontradoException;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class TratamentoDeErros {

    @ExceptionHandler(PontoNaoEncontradoException.class)
    public ResponseEntity<ProblemDetail> pontoNaoEncontrado(PontoNaoEncontradoException ex) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problema.setTitle("Ponto não encontrado");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problema);
    }

    @ExceptionHandler(DoacaoNaoEncontradaException.class)
    public ResponseEntity<ProblemDetail> doacaoNaoEncontrada(DoacaoNaoEncontradaException ex) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problema.setTitle("Doação não encontrada");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problema);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> erroDeValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            erros.put(erro.getField(), erro.getDefaultMessage());
        }
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Um ou mais campos obrigatórios estão inválidos ou vazios."
        );
        problema.setTitle("Erro de validação");
        problema.setProperty("campos", erros);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problema);
    }

    @ExceptionHandler(PropertyReferenceException.class)
    public ResponseEntity<ProblemDetail> propriedadeOrdenacaoInvalida(PropertyReferenceException ex) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Campo de ordenação inválido: " + ex.getPropertyName()
        );
        problema.setTitle("Parâmetro de ordenação inválido");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problema);
    }
}
