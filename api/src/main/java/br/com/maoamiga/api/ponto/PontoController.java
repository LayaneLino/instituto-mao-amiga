package br.com.maoamiga.api.ponto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Pontos de Coleta", description = "Endpoints para consulta e localização dos pontos de arrecadação de doações")
@RestController
@RequestMapping("/pontos")
public class PontoController {

    private final PontoService service;

    public PontoController(PontoService service) {
        this.service = service;
    }

    /**
     * GET /pontos?page=0&size=20&sort=nome,asc
     * Resposta: { "content": [ ... ], "page": { "size", "number", "totalElements", "totalPages" } }
     */
    @Operation(
        summary = "Listar pontos de coleta",
        description = "Retorna uma lista paginada dos pontos de coleta com suporte a ordenação (sort) e paginação (page, size)."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista paginada retornada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Parâmetro de ordenação ou consulta inválido")
    })
    @GetMapping
    public PagedModel<PontoResponse> listar(
            @Parameter(description = "Configuração de paginação e ordenação (ex: page=0, size=20, sort=nome,asc)")
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return new PagedModel<>(service.listar(pageable));
    }

    @Operation(
        summary = "Buscar ponto de coleta por ID",
        description = "Retorna os detalhes completos de um ponto de coleta específico pelo seu identificador único."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ponto de coleta localizado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Ponto de coleta não encontrado")
    })
    @GetMapping("/{id}")
    public PontoResponse buscarPorId(
            @Parameter(description = "Identificador numérico do ponto de coleta", example = "1")
            @PathVariable Long id) {
        return service.buscarPorId(id);
    }
}
