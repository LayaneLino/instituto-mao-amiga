package br.com.maoamiga.api.ponto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pontos")
public class Ponto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String diasHorarios;

    @Column(nullable = false)
    private String itensRecebeDistribui;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    protected Ponto() {
        // exigido pelo JPA
    }

    public Ponto(String nome, String endereco, String diasHorarios, String itensRecebeDistribui,
                 Double latitude, Double longitude) {
        this.nome = nome;
        this.endereco = endereco;
        this.diasHorarios = diasHorarios;
        this.itensRecebeDistribui = itensRecebeDistribui;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEndereco() { return endereco; }
    public String getDiasHorarios() { return diasHorarios; }
    public String getItensRecebeDistribui() { return itensRecebeDistribui; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
}
