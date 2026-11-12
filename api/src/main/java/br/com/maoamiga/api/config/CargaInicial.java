package br.com.maoamiga.api.config;

import br.com.maoamiga.api.entity.Ponto;
import br.com.maoamiga.api.repository.PontoRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Carga inicial dos pontos de Goiânia. Roda na subida da aplicação, só se a tabela estiver vazia.
 */
@Component
public class CargaInicial implements ApplicationRunner {

    private final PontoRepository repository;

    public CargaInicial(PontoRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repository.count() > 0) {
            return;
        }

        repository.saveAll(List.of(
                new Ponto(
                        "Instituto Mão Amiga",
                        "Av. Deputado Jamel Cecílio, 2690",
                        "Jardim Goiás",
                        "Seg a Sex, 8h às 18h",
                        "coleta"
                ),
                new Ponto(
                        "Faculdade SENAI Fatesg",
                        "Rua 227-A, 95",
                        "Setor Leste Universitário",
                        "Seg a Sex, 8h às 21h",
                        "coleta"
                ),
                new Ponto(
                        "Sesi Multiparque",
                        "Av. João Leite, 915",
                        "Santa Genoveva",
                        "Sábados, 8h às 12h",
                        "coleta"
                ),
                new Ponto(
                        "Casa da Indústria - FIEG",
                        "Av. Araguaia, 1544",
                        "Setor Leste Vila Nova",
                        "Sábados, 12h às 16h",
                        "coleta"
                ),
                new Ponto(
                        "Centro Cultural Oscar Niemeyer",
                        "Av. Deputado Jamel Cecílio, Km 01",
                        "Chácaras Alto da Glória",
                        "Ter a Dom, 14h às 19h",
                        "distribuição"
                ),
                new Ponto(
                        "Shopping Flamboyant",
                        "Av. Deputado Jamel Cecílio, 3300",
                        "Jardim Goiás",
                        "Domingos, 7h às 13h",
                        "distribuição"
                ),
                new Ponto(
                        "Shopping Cerrado",
                        "Av. Anhanguera, 10790",
                        "Aeroviário",
                        "Qua e Sex, 9h às 17h",
                        "distribuição"
                ),
                new Ponto(
                        "Shopping Passeio das Águas",
                        "Av. Perimetral Norte, 8303",
                        "Fazenda Caveiras",
                        "Segundas-feiras, 18h às 21h",
                        "distribuição"
                )
        ));
    }
}
