package br.com.maoamiga.api.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:maoamiga_test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class PontoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void listarDevolvePeloMenosVinteECincoPontosDaCargaInicial() throws Exception {
        mockMvc.perform(get("/api/v1/pontos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(greaterThanOrEqualTo(25)))
                .andExpect(jsonPath("$[0].id").isNotEmpty())
                .andExpect(jsonPath("$[0].nome").isNotEmpty())
                .andExpect(jsonPath("$[0].endereco").isNotEmpty())
                .andExpect(jsonPath("$[0].bairro").isNotEmpty())
                .andExpect(jsonPath("$[0].horario").isNotEmpty())
                .andExpect(jsonPath("$[0].tipo").isNotEmpty());
    }

    @Test
    void filtroSemParametroDevolvePrimeiraPaginaOrdenadaPorNomeComDezItensNoFormatoViaDto() throws Exception {
        mockMvc.perform(get("/api/v1/pontos/filtro"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.page.size").value(10))
                .andExpect(jsonPath("$.page.number").value(0))
                .andExpect(jsonPath("$.page.totalElements").value(greaterThanOrEqualTo(25)))
                .andExpect(jsonPath("$.content[0].nome").value("Araguaia Shopping"));
    }

    @Test
    void filtroBuscaPorNomeOuBairroSemDiferenciarMaiusculasEMinusculas() throws Exception {
        mockMvc.perform(get("/api/v1/pontos/filtro")
                        .param("filtro", "bueno"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(3))
                .andExpect(jsonPath("$.page.totalElements").value(3));
    }

    @Test
    void filtroRespeitaSegundaPaginaEOrdenacaoPorBairro() throws Exception {
        mockMvc.perform(get("/api/v1/pontos/filtro")
                        .param("page", "1")
                        .param("size", "10")
                        .param("sort", "bairro,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.page.number").value(1))
                .andExpect(jsonPath("$.page.size").value(10));
    }

    @Test
    void cadastrarBuscarAtualizarEExcluirPonto() throws Exception {
        String novoJson = """
                {
                  "nome": "Ponto Teste",
                  "endereco": "Rua 10, 100",
                  "bairro": "Setor Oeste",
                  "horario": "Seg a Sex, 8h às 17h",
                  "tipo": "coleta"
                }
                """;

        MvcResult postResult = mockMvc.perform(post("/api/v1/pontos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(novoJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.nome").value("Ponto Teste"))
                .andExpect(jsonPath("$.bairro").value("Setor Oeste"))
                .andExpect(jsonPath("$.tipo").value("coleta"))
                .andReturn();

        JsonNode criado = objectMapper.readTree(postResult.getResponse().getContentAsString());
        String id = criado.get("id").asText();

        mockMvc.perform(get("/api/v1/pontos/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.nome").value("Ponto Teste"));

        String atualizadoJson = """
                {
                  "nome": "Ponto Teste Atualizado",
                  "endereco": "Rua 10, 200",
                  "bairro": "Setor Bueno",
                  "horario": "Sábados, 9h às 13h",
                  "tipo": "distribuição"
                }
                """;

        mockMvc.perform(put("/api/v1/pontos/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(atualizadoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.nome").value("Ponto Teste Atualizado"))
                .andExpect(jsonPath("$.bairro").value("Setor Bueno"))
                .andExpect(jsonPath("$.tipo").value("distribuição"));

        mockMvc.perform(delete("/api/v1/pontos/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/pontos/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void getEPutEDeleteDeIdInexistenteRespondem404() throws Exception {
        UUID idInexistente = UUID.randomUUID();
        String validoJson = """
                {
                  "nome": "Ponto",
                  "endereco": "Rua A",
                  "bairro": "Centro",
                  "horario": "8h às 12h",
                  "tipo": "coleta"
                }
                """;

        mockMvc.perform(get("/api/v1/pontos/" + idInexistente))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/v1/pontos/" + idInexistente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validoJson))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/v1/pontos/" + idInexistente))
                .andExpect(status().isNotFound());
    }

    @Test
    void cadastroOuEdicaoComCampoObrigatorioVazioResponde400ENaoGravaNada() throws Exception {
        MvcResult antes = mockMvc.perform(get("/api/v1/pontos")).andReturn();
        JsonNode listaAntes = objectMapper.readTree(antes.getResponse().getContentAsString());
        int totalAntes = listaAntes.size();
        String idExistente = listaAntes.get(0).get("id").asText();

        String invalidoJson = """
                {
                  "nome": "",
                  "endereco": "Rua B",
                  "bairro": "",
                  "horario": "8h às 17h",
                  "tipo": "coleta"
                }
                """;

        mockMvc.perform(post("/api/v1/pontos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidoJson))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/v1/pontos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(totalAntes));

        mockMvc.perform(put("/api/v1/pontos/" + idExistente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidoJson))
                .andExpect(status().isBadRequest());
    }
}
