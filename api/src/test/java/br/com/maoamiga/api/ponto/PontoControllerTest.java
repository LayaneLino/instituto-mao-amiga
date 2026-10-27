package br.com.maoamiga.api.ponto;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PontoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listaPaginadaTemContentEPageComVintePorPaginaPorPadrao() throws Exception {
        mockMvc.perform(get("/pontos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(8))
                .andExpect(jsonPath("$.page.size").value(20))
                .andExpect(jsonPath("$.page.number").value(0))
                .andExpect(jsonPath("$.page.totalElements").value(8))
                .andExpect(jsonPath("$.page.totalPages").value(1));
    }

    @Test
    void tamanhoDePaginaEhLimitadoACinquenta() throws Exception {
        mockMvc.perform(get("/pontos").param("size", "1000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page.size").value(50));
    }

    @Test
    void respeitaPageSizeESort() throws Exception {
        mockMvc.perform(get("/pontos").param("page", "1").param("size", "3").param("sort", "nome,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(3))
                .andExpect(jsonPath("$.page.number").value(1))
                .andExpect(jsonPath("$.page.totalPages").value(3));
    }

    @Test
    void ordenarPorCampoInexistenteResponde400() throws Exception {
        mockMvc.perform(get("/pontos").param("sort", "naoExiste,asc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void buscaPorIdDevolveOPonto() throws Exception {
        mockMvc.perform(get("/pontos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Instituto Mão Amiga"))
                .andExpect(jsonPath("$.latitude").isNumber())
                .andExpect(jsonPath("$.longitude").isNumber());
    }

    @Test
    void idInexistenteResponde404() throws Exception {
        mockMvc.perform(get("/pontos/9999"))
                .andExpect(status().isNotFound());
    }
}
