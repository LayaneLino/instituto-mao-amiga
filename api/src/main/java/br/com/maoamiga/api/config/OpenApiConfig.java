package br.com.maoamiga.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Instituto Mão Amiga API")
                        .version("1.0.0")
                        .description("API REST para consulta e localização de pontos parceiros de arrecadação de doações.")
                        .contact(new Contact()
                                .name("Instituto Mão Amiga")
                                .email("contato@maoamiga.org.br")));
    }
}
