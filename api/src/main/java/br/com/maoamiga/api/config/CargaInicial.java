package br.com.maoamiga.api.config;

import java.util.List;

import br.com.maoamiga.api.ponto.Ponto;
import br.com.maoamiga.api.ponto.PontoRepository;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Carga inicial dos pontos de Goiânia. Roda na subida da aplicação, só se a tabela estiver vazia.
 *
 * ATENÇÃO: as coordenadas abaixo são aproximadas. Antes de entregar, confira cada uma no
 * Google Maps (clique com o botão direito sobre o local e copie "latitude, longitude") e corrija.
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
                new Ponto("Instituto Mão Amiga", "Avenida Jamel Cecílio",
                        "Segunda a Sexta, das 08h às 18h",
                        "Recebe: Alimentos e roupas.",
                        -16.7064, -49.2417),
                new Ponto("Fatesg", "Rua 227a",
                        "Segunda a Sexta, das 08h às 21h",
                        "Recebe: Brinquedos e materiais escolares.",
                        -16.6726, -49.2453),
                new Ponto("Sesi Multiparque", "Avenida João Leite",
                        "Sábados, das 08h às 12h",
                        "Recebe: Móveis/eletrodomésticos e sapatos.",
                        -16.6339, -49.2888),
                new Ponto("Casa da Indústria", "Avenida Araguaia",
                        "Sábados, das 12h às 16h",
                        "Recebe: Itens de cama, mesa e banho.",
                        -16.6748, -49.2569),
                new Ponto("Centro Cultural Oscar Niemeyer", "GO-020",
                        "Terça a Domingo, das 14h às 19h",
                        "Distribui: Cestas básicas e produtos de higiene pessoal.",
                        -16.6580, -49.2160),
                new Ponto("Shopping Flamboyant", "Avenida Deputado Jamel Cecílio",
                        "Domingos, das 07h às 13h",
                        "Distribui: Marmitas prontas e agasalhos.",
                        -16.7106, -49.2367),
                new Ponto("Shopping Cerrado", "Avenida Anhanguera",
                        "Quartas e Sextas, das 09h às 17h",
                        "Distribui: Roupas infantis e fraldas.",
                        -16.6563, -49.3037),
                new Ponto("Shopping Passeio das Águas", "Avenida Perimetral Norte",
                        "Segundas-feiras, das 18h às 21h",
                        "Distribui: Cobertores e refeições.",
                        -16.6404, -49.3125)
        ));
    }
}
