package br.com.maoamiga.api.dto;

import br.com.maoamiga.api.entity.Ponto;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Dados de retorno de um ponto de coleta/distribuição")
public record PontoResponseDTO(
        UUID id,
        String nome,
        String endereco,
        String bairro,
        String horario,
        String tipo
) {
    public static PontoResponseDTO de(Ponto ponto) {
        return new PontoResponseDTO(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getBairro(),
                ponto.getHorario(),
                ponto.getTipo()
        );
    }
}
