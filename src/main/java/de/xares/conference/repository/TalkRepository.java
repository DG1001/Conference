package de.xares.conference.repository;

import de.xares.conference.domain.Talk;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Talk entity.
 */
@Repository
public interface TalkRepository extends JpaRepository<Talk, Long> {
    default Optional<Talk> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Talk> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Talk> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select talk from Talk talk left join fetch talk.room", countQuery = "select count(talk) from Talk talk")
    Page<Talk> findAllWithToOneRelationships(Pageable pageable);

    @Query("select talk from Talk talk left join fetch talk.room")
    List<Talk> findAllWithToOneRelationships();

    @Query("select talk from Talk talk left join fetch talk.room where talk.id =:id")
    Optional<Talk> findOneWithToOneRelationships(@Param("id") Long id);
}
