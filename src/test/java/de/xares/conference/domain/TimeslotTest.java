package de.xares.conference.domain;

import static de.xares.conference.domain.TimeslotTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import de.xares.conference.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TimeslotTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Timeslot.class);
        Timeslot timeslot1 = getTimeslotSample1();
        Timeslot timeslot2 = new Timeslot();
        assertThat(timeslot1).isNotEqualTo(timeslot2);

        timeslot2.setId(timeslot1.getId());
        assertThat(timeslot1).isEqualTo(timeslot2);

        timeslot2 = getTimeslotSample2();
        assertThat(timeslot1).isNotEqualTo(timeslot2);
    }
}
