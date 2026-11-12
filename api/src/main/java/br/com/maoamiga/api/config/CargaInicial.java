package br.com.maoamiga.api.config;

import br.com.maoamiga.api.entity.Ponto;
import br.com.maoamiga.api.repository.PontoRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CargaInicial implements ApplicationRunner {

    private final PontoRepository repository;

    public CargaInicial(PontoRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repository.count() >= 25) {
            return;
        }

        List<Ponto> pontosIniciais = List.of(
                new Ponto("Instituto Mão Amiga", "Av. Deputado Jamel Cecílio, 2690", "Jardim Goiás", "Seg a Sex, 8h às 18h", "coleta"),
                new Ponto("Faculdade SENAI Fatesg", "Rua 227-A, 95", "Setor Leste Universitário", "Seg a Sex, 8h às 21h", "coleta"),
                new Ponto("Sesi Multiparque", "Av. João Leite, 915", "Santa Genoveva", "Sábados, 8h às 12h", "coleta"),
                new Ponto("Casa da Indústria - FIEG", "Av. Araguaia, 1544", "Setor Leste Vila Nova", "Sábados, 12h às 16h", "coleta"),
                new Ponto("Centro Cultural Oscar Niemeyer", "Av. Deputado Jamel Cecílio, Km 01", "Chácaras Alto da Glória", "Ter a Dom, 14h às 19h", "distribuição"),
                new Ponto("Shopping Flamboyant", "Av. Deputado Jamel Cecílio, 3300", "Jardim Goiás", "Domingos, 7h às 13h", "distribuição"),
                new Ponto("Shopping Cerrado", "Av. Anhanguera, 10790", "Aeroviário", "Qua e Sex, 9h às 17h", "distribuição"),
                new Ponto("Shopping Passeio das Águas", "Av. Perimetral Norte, 8303", "Fazenda Caveiras", "Segundas-feiras, 18h às 21h", "distribuição"),
                new Ponto("Paróquia Universitária São João Evangelista", "Praça Universitária, 1440", "Setor Leste Universitário", "Seg a Sex, 8h às 17h", "coleta"),
                new Ponto("Catedral Metropolitana de Goiânia", "Praça Dom Emanuel, s/n", "Setor Central", "Seg a Sex, 7h às 18h", "distribuição"),
                new Ponto("Sesc Cidadania", "Av. C-197, 450", "Jardim América", "Seg a Sex, 8h às 19h", "coleta"),
                new Ponto("Sesc Centro", "Rua 15, esquina com Rua 19", "Setor Central", "Seg a Sáb, 8h às 17h", "coleta"),
                new Ponto("Senac Cora Coralina", "Av. Independência, 1002", "Setor Leste Vila Nova", "Seg a Sex, 8h às 20h", "coleta"),
                new Ponto("Centro Comunitário Vila Mutirão", "Av. do Povo, 510", "Vila Mutirão", "Ter e Qui, 9h às 16h", "distribuição"),
                new Ponto("Associação Solidária Campinas", "Av. 24 de Outubro, 1820", "Setor Campinas", "Seg a Sex, 9h às 17h", "distribuição"),
                new Ponto("Paróquia Nossa Senhora da Assunção", "Rua R-44, 150", "Vila Itatiaia", "Seg a Sáb, 8h às 18h", "coleta"),
                new Ponto("Goiânia Shopping", "Av. T-10, 1300", "Setor Bueno", "Seg a Sáb, 10h às 22h", "coleta"),
                new Ponto("Araguaia Shopping", "Rua 44, 399", "Setor Central", "Seg a Sáb, 8h30 às 20h30", "coleta"),
                new Ponto("Buriti Shopping", "Av. Rio Verde, Qd. 102/104", "Vila São Tomaz", "Seg a Sáb, 10h às 22h", "coleta"),
                new Ponto("Parque Vaca Brava - Ponto Solidário", "Av. T-10, s/n", "Setor Bueno", "Sáb e Dom, 8h às 14h", "coleta"),
                new Ponto("Parque Flamboyant - Ação Comunitária", "Rua 15, s/n", "Jardim Goiás", "Sáb e Dom, 8h às 12h", "distribuição"),
                new Ponto("Parque Areião - Coleta Verde", "Av. Areião, s/n", "Setor Pedro Ludovico", "Seg a Sex, 7h às 17h", "coleta"),
                new Ponto("Ginásio Rio Vermelho", "Av. Paranaíba, 1155", "Setor Central", "Qua a Sex, 8h às 17h", "distribuição"),
                new Ponto("CRAS Jardim Curitiba", "Av. do Povo, Qd. 42", "Jardim Curitiba", "Seg a Sex, 8h às 17h", "distribuição"),
                new Ponto("CRAS Novo Horizonte", "Av. César Lattes, 1210", "Setor Novo Horizonte", "Seg a Sex, 8h às 17h", "distribuição"),
                new Ponto("Casa de Apoio São Vicente", "Rua T-37, 2910", "Setor Bueno", "Seg a Sex, 8h às 18h", "distribuição")
        );

        List<Ponto> novos = pontosIniciais.stream()
                .filter(p -> !repository.existsByNomeIgnoreCase(p.getNome()))
                .toList();

        if (!novos.isEmpty()) {
            repository.saveAll(novos);
        }
    }
}
