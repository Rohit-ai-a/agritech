package com.agri.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SchemaFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Drop the outdated check constraint.
            // Hibernate might try to recreate it, or we simply live without it at DB level
            // relying on JPA format.
            // The constraint name 'trades_status_check' comes from the user's error log.
            String sql = "ALTER TABLE trades DROP CONSTRAINT IF EXISTS trades_status_check";
            jdbcTemplate.execute(sql);
            System.out.println("SchemaFixer: SUCCESS - Dropped outdated 'trades_status_check' constraint.");
        } catch (Exception e) {
            System.err.println("SchemaFixer: WARNING - Failed to drop constraint (it might not exist or verify name): "
                    + e.getMessage());
        }
    }
}
