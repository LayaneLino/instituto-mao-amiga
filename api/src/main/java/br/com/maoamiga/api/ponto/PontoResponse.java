package br.com.maoamiga.api.ponto;

/**
 * DTO devolvido pela API. O app espelha estes campos em src/types/ponto.ts.
 */
public record PontoResponse(
        Long id,
        String nome,
        String endereco,
        String diasHorarios,
        String itensRecebeDistribui,
        Double latitude,
        Double longitude
) {

    public static PontoResponse de(Ponto ponto) {
        return new PontoResponse(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getDiasHorarios(),
                ponto.getItensRecebeDistribui(),
                ponto.getLatitude(),
                ponto.getLongitude()
        );
    }
}
