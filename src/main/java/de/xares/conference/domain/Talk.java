package de.xares.conference.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Talk.
 */
@Entity
@Table(name = "talk")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Talk implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "speaker", nullable = false)
    private String speaker;

    @Lob
    @Column(name = "abstract_text", nullable = false)
    private String abstractText;

    @ManyToOne(optional = false)
    @NotNull
    private Room room;

    @ManyToOne(optional = false)
    @NotNull
    private Timeslot timeslot;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Talk id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Talk title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSpeaker() {
        return this.speaker;
    }

    public Talk speaker(String speaker) {
        this.setSpeaker(speaker);
        return this;
    }

    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }

    public String getAbstractText() {
        return this.abstractText;
    }

    public Talk abstractText(String abstractText) {
        this.setAbstractText(abstractText);
        return this;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public Room getRoom() {
        return this.room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Talk room(Room room) {
        this.setRoom(room);
        return this;
    }

    public Timeslot getTimeslot() {
        return this.timeslot;
    }

    public void setTimeslot(Timeslot timeslot) {
        this.timeslot = timeslot;
    }

    public Talk timeslot(Timeslot timeslot) {
        this.setTimeslot(timeslot);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Talk)) {
            return false;
        }
        return getId() != null && getId().equals(((Talk) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Talk{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", speaker='" + getSpeaker() + "'" +
            ", abstractText='" + getAbstractText() + "'" +
            "}";
    }
}
