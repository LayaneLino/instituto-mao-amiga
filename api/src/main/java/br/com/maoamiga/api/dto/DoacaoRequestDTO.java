package br.com.maoamiga.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "Dados de entrada para cadastro ou atualização de uma doação")
public record DoacaoRequestDTO(
        @Schema(description = "Categoria ou tipo do item doado", example = "Cesta Básica")
        @NotBlank(message = "O tipo do item é obrigatório")
        String tipoItem,

        @Schema(description = "Quantidade inteira de itens (maior que zero)", example = "5")
        @NotNull(message = "A quantidade é obrigatória")
        @Positive(message = "A quantidade deve ser maior que zero")
        Integer quantidade,

        @Schema(description = "Nome do ponto de coleta/distribuição de destino", example = "Instituto Mão Amiga")
        @NotBlank(message = "O ponto de destino é obrigatório")
        String pontoDestino
) {
}
