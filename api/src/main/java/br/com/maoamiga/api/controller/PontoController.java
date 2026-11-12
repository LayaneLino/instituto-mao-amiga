package br.com.maoamiga.api.controller;

import br.com.maoamiga.api.dto.PontoRequestDTO;
import br.com.maoamiga.api.dto.PontoResponseDTO;
import br.com.maoamiga.api.service.PontoService;
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

@Tag(name = "Pontos de Coleta", description = "CRUD e busca paginada de pontos de coleta e distribuição")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/pontos")
public class PontoController {

    private final PontoService service;

    public PontoController(PontoService service) {
        this.service = service;
    }

    @Operation(summary = "Listar todos os pontos", description = "Retorna todos os pontos de coleta e distribuição cadastrados.")
    @ApiResponse(responseCode = "200", description = "Lista de pontos retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<PontoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @Operation(
            summary = "Buscar pontos com filtro e paginação",
            description = "Filtra pontos pelo nome ou bairro (sem diferenciar maiúsculas/minúsculas) com suporte a paginação e ordenação."
    )
    @Parameters({
            @Parameter(name = "page", in = ParameterIn.QUERY, description = "Número da página (começa em 0)", schema = @Schema(type = "integer", defaultValue = "0")),
            @Parameter(name = "size", in = ParameterIn.QUERY, description = "Quantidade de itens por página", schema = @Schema(type = "integer", defaultValue = "10")),
            @Parameter(name = "sort", in = ParameterIn.QUERY, description = "Critério de ordenação (ex: nome,asc ou bairro,asc)", schema = @Schema(type = "string", defaultValue = "nome,asc"))
    })
    @ApiResponse(responseCode = "200", description = "Página de pontos retornada com sucesso")
    @GetMapping("/filtro")
    public ResponseEntity<Page<PontoResponseDTO>> buscarPorFiltro(
            @Parameter(description = "Texto buscado no nome ou no bairro (opcional)")
            @RequestParam(required = false) String filtro,
            @Parameter(hidden = true)
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return ResponseEntity.ok(service.buscarPorFiltro(filtro, pageable));
    }

    @Operation(summary = "Buscar ponto por ID", description = "Retorna um ponto específico pelo seu UUID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ponto encontrado"),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PontoResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @Operation(summary = "Cadastrar novo ponto", description = "Cadastra um novo ponto de coleta ou distribuição.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Ponto criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos (campos obrigatórios vazios)")
    })
    @PostMapping
    public ResponseEntity<PontoResponseDTO> cadastrar(@Valid @RequestBody PontoRequestDTO dto) {
        PontoResponseDTO criado = service.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @Operation(summary = "Atualizar ponto por ID", description = "Atualiza os dados de um ponto existente pelo seu UUID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ponto atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos (campos obrigatórios vazios)"),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PontoResponseDTO> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody PontoRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @Operation(summary = "Excluir ponto por ID", description = "Remove um ponto de coleta ou distribuição pelo seu UUID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Ponto excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Ponto não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
