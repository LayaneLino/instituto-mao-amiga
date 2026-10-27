package br.com.maoamiga.api.ponto;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PontoService {

    // Campos aceitos em ?sort=campo,asc|desc. Qualquer outro vira 400 (e não 500).
    private static final Set<String> CAMPOS_ORDENAVEIS = Set.of(
            "id", "nome", "endereco", "diasHorarios", "itensRecebeDistribui", "latitude", "longitude");

    private final PontoRepository repository;

    public PontoService(PontoRepository repository) {
        this.repository = repository;
    }

    public Page<PontoResponse> listar(Pageable pageable) {
        for (Sort.Order ordem : pageable.getSort()) {
            if (!CAMPOS_ORDENAVEIS.contains(ordem.getProperty())) {
                throw new ParametroInvalidoException(
                        "Não é possível ordenar por '" + ordem.getProperty() + "'. Campos válidos: "
                                + String.join(", ", CAMPOS_ORDENAVEIS.stream().sorted().toList()) + ".");
            }
        }
        return repository.findAll(pageable).map(PontoResponse::de);
    }

    public PontoResponse buscarPorId(Long id) {
        return repository.findById(id)
                .map(PontoResponse::de)
                .orElseThrow(() -> new PontoNaoEncontradoException(id));
    }
}
