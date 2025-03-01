package de.xares.conference.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class TimeslotTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Timeslot getTimeslotSample1() {
        return new Timeslot().id(1L);
    }

    public static Timeslot getTimeslotSample2() {
        return new Timeslot().id(2L);
    }

    public static Timeslot getTimeslotRandomSampleGenerator() {
        return new Timeslot().id(longCount.incrementAndGet());
    }
}
