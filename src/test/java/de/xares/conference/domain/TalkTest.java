package de.xares.conference.domain;

import static de.xares.conference.domain.RoomTestSamples.*;
import static de.xares.conference.domain.TalkTestSamples.*;
import static de.xares.conference.domain.TimeslotTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.xares.conference.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TalkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Talk.class);
        Talk talk1 = getTalkSample1();
        Talk talk2 = new Talk();
        assertThat(talk1).isNotEqualTo(talk2);

        talk2.setId(talk1.getId());
        assertThat(talk1).isEqualTo(talk2);

        talk2 = getTalkSample2();
        assertThat(talk1).isNotEqualTo(talk2);
    }

    @Test
    void roomTest() {
        Talk talk = getTalkRandomSampleGenerator();
        Room roomBack = getRoomRandomSampleGenerator();

        talk.setRoom(roomBack);
        assertThat(talk.getRoom()).isEqualTo(roomBack);

        talk.room(null);
        assertThat(talk.getRoom()).isNull();
    }

    @Test
    void timeslotTest() {
        Talk talk = getTalkRandomSampleGenerator();
        Timeslot timeslotBack = getTimeslotRandomSampleGenerator();

        talk.setTimeslot(timeslotBack);
        assertThat(talk.getTimeslot()).isEqualTo(timeslotBack);

        talk.timeslot(null);
        assertThat(talk.getTimeslot()).isNull();
    }
}
