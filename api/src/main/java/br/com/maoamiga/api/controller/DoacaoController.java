package br.com.maoamiga.api.controller;

import br.com.maoamiga.api.dto.DoacaoRequestDTO;
import br.com.maoamiga.api.dto.DoacaoResponseDTO;
import br.com.maoamiga.api.service.DoacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Doações", description = "CRUD e busca paginada de doações registradas")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/doacoes")
public class DoacaoController {

    private final DoacaoService service;

    public DoacaoController(DoacaoService service) {
        this.service = service;
    }

    @Operation(summary = "Listar todas as doações", description = "Retorna todas as doações cadastradas.")
    @ApiResponse(responseCode = "200", description = "Lista de doações retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<DoacaoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @Operation(
            summary = "Buscar doações com filtro e paginação",
            description = "Filtra doações pelo tipo de item (sem diferenciar maiúsculas/minúsculas), ordenadas da mais nova para a mais antiga por padrão."
    )
    @Parameters({
            @Parameter(name = "page", in = ParameterIn.QUERY, description = "Número da página (começa em 0)", schema = @Schema(type = "integer", defaultValue = "0")),
            @Parameter(name = "size", in = ParameterIn.QUERY, description = "Quantidade de itens por página", schema = @Schema(type = "integer", defaultValue = "10")),
            @Parameter(name = "sort", in = ParameterIn.QUERY, description = "Critério de ordenação (ex: criadoEm,desc)", schema = @Schema(type = "string", defaultValue = "criadoEm,desc"))
    })
    @ApiResponse(responseCode = "200", description = "Página de doações retornada com sucesso")
    @GetMapping("/filtro")
    public ResponseEntity<Page<DoacaoResponseDTO>> buscarPorFiltro(
            @Parameter(description = "Texto buscado no tipo de item (opcional)")
            @RequestParam(required = false) String filtro,
            @Parameter(hidden = true)
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(service.buscarPorFiltro(filtro, pageable));
    }

    @Operation(summary = "Buscar doação por ID", description = "Retorna os detalhes de uma doação pelo seu UUID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Doação encontrada"),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @Operation(summary = "Cadastrar nova doação", description = "Registra uma nova doação com data/hora gerada no servidor.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Doação cadastrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos (campos vazios ou quantidade <= 0)")
    })
    @PostMapping
    public ResponseEntity<DoacaoResponseDTO> cadastrar(@Valid @RequestBody DoacaoRequestDTO dto) {
        DoacaoResponseDTO criada = service.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @Operation(summary = "Atualizar doação por ID", description = "Atualiza tipoItem, quantidade e pontoDestino, mantendo id e criadoEm.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Doação atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos (campos vazios ou quantidade <= 0)"),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody DoacaoRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @Operation(summary = "Excluir doação por ID", description = "Remove uma doação pelo seu UUID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Doação excluída com sucesso"),
            @ApiResponse(responseCode = "404", description = "Doação não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
