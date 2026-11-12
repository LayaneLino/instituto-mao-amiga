package br.com.maoamiga.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Dados de entrada para criação ou atualização de um ponto de coleta/distribuição")
public record PontoRequestDTO(
        @Schema(description = "Nome do ponto", example = "Instituto Mão Amiga")
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @Schema(description = "Endereço do ponto", example = "Av. Deputado Jamel Cecílio, 2690")
        @NotBlank(message = "O endereço é obrigatório")
        String endereco,

        @Schema(description = "Bairro do ponto", example = "Jardim Goiás")
        @NotBlank(message = "O bairro é obrigatório")
        String bairro,

        @Schema(description = "Dias e horários de funcionamento", example = "Seg a Sex, 8h às 18h")
        @NotBlank(message = "O horário é obrigatório")
        String horario,

        @Schema(description = "Tipo do ponto: coleta ou distribuição", example = "coleta")
        @NotBlank(message = "O tipo é obrigatório")
        String tipo
) {
}
