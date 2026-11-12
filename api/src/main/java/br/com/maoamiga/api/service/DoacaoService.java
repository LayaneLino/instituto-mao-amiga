package br.com.maoamiga.api.service;

import br.com.maoamiga.api.dto.DoacaoRequestDTO;
import br.com.maoamiga.api.dto.DoacaoResponseDTO;
import br.com.maoamiga.api.entity.Doacao;
import br.com.maoamiga.api.repository.DoacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class DoacaoService {

    private final DoacaoRepository repository;

    public DoacaoService(DoacaoRepository repository) {
        this.repository = repository;
    }

    public List<DoacaoResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(DoacaoResponseDTO::de)
                .toList();
    }

    public Page<DoacaoResponseDTO> buscarPorFiltro(String filtro, Pageable pageable) {
        String termo = (filtro == null) ? "" : filtro.trim();
        if (termo.isEmpty()) {
            return repository.findAll(pageable).map(DoacaoResponseDTO::de);
        }
        return repository.buscarPorFiltro(termo, pageable).map(DoacaoResponseDTO::de);
    }

    public DoacaoResponseDTO buscarPorId(UUID id) {
        return repository.findById(id)
                .map(DoacaoResponseDTO::de)
                .orElseThrow(() -> new DoacaoNaoEncontradaException(id));
    }

    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO dto) {
        Doacao doacao = new Doacao(
                dto.tipoItem().trim(),
                dto.quantidade(),
                dto.pontoDestino().trim(),
                LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)
        );
        Doacao salva = repository.save(doacao);
        return DoacaoResponseDTO.de(salva);
    }

    public DoacaoResponseDTO atualizar(UUID id, DoacaoRequestDTO dto) {
        Doacao doacao = repository.findById(id)
                .orElseThrow(() -> new DoacaoNaoEncontradaException(id));

        doacao.setTipoItem(dto.tipoItem().trim());
        doacao.setQuantidade(dto.quantidade());
        doacao.setPontoDestino(dto.pontoDestino().trim());

        Doacao atualizada = repository.save(doacao);
        return DoacaoResponseDTO.de(atualizada);
    }

    public void excluir(UUID id) {
        if (!repository.existsById(id)) {
            throw new DoacaoNaoEncontradaException(id);
        }
        repository.deleteById(id);
    }
}
