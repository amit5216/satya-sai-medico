package com.satyasaimedico.repository;

import com.satyasaimedico.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ============================================================
 * ADMIN REPOSITORY — Data Access Layer for Admin entity
 * ============================================================
 *
 * 🎓 WHAT IS A REPOSITORY?
 * A Repository is an INTERFACE (not a class!) that provides
 * methods to interact with the database.
 *
 * 🎓 HOW DOES IT WORK WITHOUT WRITING CODE?
 * JpaRepository<Admin, Long> gives us these methods FOR FREE:
 *   - save(admin)        → INSERT or UPDATE
 *   - findById(id)       → SELECT WHERE id = ?
 *   - findAll()          → SELECT * FROM admin
 *   - deleteById(id)     → DELETE WHERE id = ?
 *   - count()            → SELECT COUNT(*) FROM admin
 *   - existsById(id)     → SELECT EXISTS(...)
 *
 * We don't write a single line of SQL — Spring Data JPA
 * generates the implementation at runtime using PROXY PATTERN.
 *
 * 🎓 CUSTOM QUERY METHODS (Derived Queries):
 * Spring Data JPA reads the method name and auto-generates SQL:
 *   findByUsername("admin") → SELECT * FROM admin WHERE username = 'admin'
 *
 * The naming convention is:
 *   findBy + FieldName → Simple WHERE clause
 *   findByFieldNameAndField2 → WHERE field1 = ? AND field2 = ?
 *   existsByFieldName → EXISTS query
 */
@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    /**
     * Find admin by username.
     * Spring generates: SELECT * FROM admin WHERE username = ?
     *
     * Returns Optional<Admin> because the admin might not exist.
     * Optional forces us to handle the "not found" case properly.
     */
    Optional<Admin> findByUsername(String username);

    /**
     * Check if a username already exists.
     * Spring generates: SELECT EXISTS(SELECT 1 FROM admin WHERE username = ?)
     */
    boolean existsByUsername(String username);
}
