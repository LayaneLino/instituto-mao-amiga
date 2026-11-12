package br.com.maoamiga.api.repository;

import br.com.maoamiga.api.entity.Ponto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PontoRepository extends JpaRepository<Ponto, UUID> {
}
