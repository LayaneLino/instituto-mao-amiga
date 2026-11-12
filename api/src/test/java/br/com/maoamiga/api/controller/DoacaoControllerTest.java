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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:maoamiga_doacao_test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class DoacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void cadastrarBuscarAtualizarFiltrarEExcluirDoacaoMantendoCriadoEm() throws Exception {
        String novaDoacaoJson = """
                {
                  "tipoItem": "Cesta Básica",
                  "quantidade": 5,
                  "pontoDestino": "Instituto Mão Amiga"
                }
                """;

        MvcResult postResult = mockMvc.perform(post("/api/v1/doacoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(novaDoacaoJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.tipoItem").value("Cesta Básica"))
                .andExpect(jsonPath("$.quantidade").value(5))
                .andExpect(jsonPath("$.pontoDestino").value("Instituto Mão Amiga"))
                .andExpect(jsonPath("$.criadoEm").isNotEmpty())
                .andReturn();

        JsonNode criada = objectMapper.readTree(postResult.getResponse().getContentAsString());
        String id = criada.get("id").asText();
        String criadoEmOriginal = criada.get("criadoEm").asText();

        mockMvc.perform(get("/api/v1/doacoes/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.tipoItem").value("Cesta Básica"))
                .andExpect(jsonPath("$.criadoEm").value(criadoEmOriginal));

        String atualizadaJson = """
                {
                  "tipoItem": "Roupas e Agasalhos",
                  "quantidade": 12,
                  "pontoDestino": "Shopping Flamboyant"
                }
                """;

        MvcResult putResult = mockMvc.perform(put("/api/v1/doacoes/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(atualizadaJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.tipoItem").value("Roupas e Agasalhos"))
                .andExpect(jsonPath("$.quantidade").value(12))
                .andExpect(jsonPath("$.pontoDestino").value("Shopping Flamboyant"))
                .andExpect(jsonPath("$.criadoEm").isNotEmpty())
                .andReturn();

        JsonNode atualizada = objectMapper.readTree(putResult.getResponse().getContentAsString());
        assertEquals(
                criadoEmOriginal.substring(0, 19),
                atualizada.get("criadoEm").asText().substring(0, 19)
        );

        mockMvc.perform(get("/api/v1/doacoes/filtro")
                        .param("filtro", "roupas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].id").value(id))
                .andExpect(jsonPath("$.page.totalElements").value(1));

        mockMvc.perform(delete("/api/v1/doacoes/" + id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/doacoes/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void getEPutEDeleteDeIdInexistenteRespondem404() throws Exception {
        UUID idInexistente = UUID.randomUUID();
        String validoJson = """
                {
                  "tipoItem": "Cobertores",
                  "quantidade": 3,
                  "pontoDestino": "Instituto Mão Amiga"
                }
                """;

        mockMvc.perform(get("/api/v1/doacoes/" + idInexistente))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/v1/doacoes/" + idInexistente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validoJson))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/v1/doacoes/" + idInexistente))
                .andExpect(status().isNotFound());
    }

    @Test
    void quantidadeZeroNegativaOuTipoVazioResponde400ENaoGravaNada() throws Exception {
        MvcResult antes = mockMvc.perform(get("/api/v1/doacoes")).andReturn();
        int totalAntes = objectMapper.readTree(antes.getResponse().getContentAsString()).size();

        String quantidadeZeroJson = """
                {
                  "tipoItem": "Calçados",
                  "quantidade": 0,
                  "pontoDestino": "Instituto Mão Amiga"
                }
                """;

        String quantidadeNegativaJson = """
                {
                  "tipoItem": "Calçados",
                  "quantidade": -5,
                  "pontoDestino": "Instituto Mão Amiga"
                }
                """;

        String tipoVazioJson = """
                {
                  "tipoItem": "",
                  "quantidade": 4,
                  "pontoDestino": "Instituto Mão Amiga"
                }
                """;

        mockMvc.perform(post("/api/v1/doacoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(quantidadeZeroJson))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/v1/doacoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(quantidadeNegativaJson))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/v1/doacoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(tipoVazioJson))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/v1/doacoes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(totalAntes));
    }
}
