package de.xares.conference.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TalkTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Talk getTalkSample1() {
        return new Talk().id(1L).title("title1").speaker("speaker1");
    }

    public static Talk getTalkSample2() {
        return new Talk().id(2L).title("title2").speaker("speaker2");
    }

    public static Talk getTalkRandomSampleGenerator() {
        return new Talk().id(longCount.incrementAndGet()).title(UUID.randomUUID().toString()).speaker(UUID.randomUUID().toString());
    }
}
