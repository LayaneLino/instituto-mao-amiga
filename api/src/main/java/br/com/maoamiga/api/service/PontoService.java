package br.com.maoamiga.api.service;

import br.com.maoamiga.api.dto.PontoRequestDTO;
import br.com.maoamiga.api.dto.PontoResponseDTO;
import br.com.maoamiga.api.entity.Ponto;
import br.com.maoamiga.api.repository.PontoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PontoService {

    private final PontoRepository repository;

    public PontoService(PontoRepository repository) {
        this.repository = repository;
    }

    public List<PontoResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(PontoResponseDTO::de)
                .toList();
    }

    public PontoResponseDTO buscarPorId(UUID id) {
        return repository.findById(id)
                .map(PontoResponseDTO::de)
                .orElseThrow(() -> new PontoNaoEncontradoException(id));
    }

    public PontoResponseDTO cadastrar(PontoRequestDTO dto) {
        Ponto ponto = new Ponto(
                dto.nome().trim(),
                dto.endereco().trim(),
                dto.bairro().trim(),
                dto.horario().trim(),
                dto.tipo().trim()
        );
        Ponto salvo = repository.save(ponto);
        return PontoResponseDTO.de(salvo);
    }

    public PontoResponseDTO atualizar(UUID id, PontoRequestDTO dto) {
        Ponto ponto = repository.findById(id)
                .orElseThrow(() -> new PontoNaoEncontradoException(id));

        ponto.setNome(dto.nome().trim());
        ponto.setEndereco(dto.endereco().trim());
        ponto.setBairro(dto.bairro().trim());
        ponto.setHorario(dto.horario().trim());
        ponto.setTipo(dto.tipo().trim());

        Ponto atualizado = repository.save(ponto);
        return PontoResponseDTO.de(atualizado);
    }

    public void excluir(UUID id) {
        if (!repository.existsById(id)) {
            throw new PontoNaoEncontradoException(id);
        }
        repository.deleteById(id);
    }
}
