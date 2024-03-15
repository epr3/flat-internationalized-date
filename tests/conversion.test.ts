/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  CALENDAR,
  toCalendar,
  toCalendarDate,
  toCalendarDateTime,
  toTime,
} from "..";
import {
  createCalendarDate,
  createCalendarDateTime,
  createTime,
  createZonedDateTime,
} from "../src/CalendarDate";
import { calendars } from "../src/calendars";
import {
  fromAbsolute,
  possibleAbsolutes,
  toAbsolute,
  toDate,
} from "../src/conversion";

import { describe, it, expect } from "vitest";

describe("CalendarDate conversion", function () {
  describe("toAbsolute", function () {
    it("should handle a normal date", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 2,
      });
      expect(toAbsolute(date, "America/Los_Angeles")).toBe(
        new Date("2020-02-03T10:00Z").getTime()
      );
    });

    it("should handle daylight saving time start", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 3,
        day: 8,
        hour: 2,
      });
      expect(toAbsolute(date, "America/Los_Angeles")).toBe(
        new Date("2020-03-08T10:00Z").getTime()
      );
    });

    it("should handle daylight saving time start with disambiguation = earlier", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 3,
        day: 8,
        hour: 2,
      });
      expect(toAbsolute(date, "America/Los_Angeles", "earlier")).toBe(
        new Date("2020-03-08T09:00Z").getTime()
      );
    });

    it("should throw with daylight saving time start if disambiguation = reject", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 3,
        day: 8,
        hour: 2,
      });
      expect(() => {
        toAbsolute(date, "America/Los_Angeles", "reject");
      }).toThrow("No such absolute time found");
    });

    it("should handle daylight saving time end", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 11,
        day: 1,
        hour: 1,
      });
      expect(toAbsolute(date, "America/Los_Angeles")).toBe(
        new Date("2020-11-01T08:00:00.000Z").getTime()
      );
    });

    it("should handle daylight saving time end with disambiguation = later", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 11,
        day: 1,
        hour: 1,
      });
      expect(toAbsolute(date, "America/Los_Angeles", "later")).toBe(
        new Date("2020-11-01T09:00:00.000Z").getTime()
      );
    });

    it("should throw with daylight saving time end if disambiguation = reject", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 11,
        day: 1,
        hour: 1,
      });
      expect(() => {
        toAbsolute(date, "America/Los_Angeles", "reject");
      }).toThrow("Multiple possible absolute times found");
    });

    it("should support passing a CalendarDate without a time", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(toAbsolute(date, "America/Los_Angeles")).toBe(
        new Date("2020-02-03T08:00Z").getTime()
      );
    });
  });

  describe("toDate", function () {
    it("should handle a normal date", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 2,
      });
      expect(toDate(date, "America/Los_Angeles")).toEqual(
        new Date("2020-02-03T10:00Z")
      );
    });

    it("should handle daylight saving time start", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 3,
        day: 8,
        hour: 2,
      });
      expect(toDate(date, "America/Los_Angeles")).toEqual(
        new Date("2020-03-08T10:00Z")
      );
    });

    it("should handle daylight saving time start with disambiguation = earlier", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 3,
        day: 8,
        hour: 2,
      });
      expect(toDate(date, "America/Los_Angeles", "earlier")).toEqual(
        new Date("2020-03-08T09:00Z")
      );
    });

    it("should throw with daylight saving time start if disambiguation = reject", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 3,
        day: 8,
        hour: 2,
      });
      expect(() => {
        toDate(date, "America/Los_Angeles", "reject");
      }).toThrow("No such absolute time found");
    });

    it("should handle daylight saving time end", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 11,
        day: 1,
        hour: 1,
      });
      expect(toDate(date, "America/Los_Angeles")).toEqual(
        new Date("2020-11-01T08:00:00.000Z")
      );
    });

    it("should handle daylight saving time end with disambiguation = later", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 11,
        day: 1,
        hour: 1,
      });
      expect(toDate(date, "America/Los_Angeles", "later")).toEqual(
        new Date("2020-11-01T09:00:00.000Z")
      );
    });

    it("should throw with daylight saving time end if disambiguation = reject", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 11,
        day: 1,
        hour: 1,
      });
      expect(() => {
        toDate(date, "America/Los_Angeles", "reject");
      }).toThrow("Multiple possible absolute times found");
    });

    it("should support passing a CalendarDate without a time", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(toDate(date, "America/Los_Angeles")).toEqual(
        new Date("2020-02-03T08:00Z")
      );
    });
  });

  describe("possibleAbsolutes", function () {
    it("should handle a normal date", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 2,
      });
      expect(possibleAbsolutes(date, "America/Los_Angeles")).toEqual([
        new Date("2020-02-03T10:00Z").getTime(),
      ]);
    });

    it("should handle daylight saving time start", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 3,
        day: 8,
        hour: 2,
      });
      expect(possibleAbsolutes(date, "America/Los_Angeles")).toEqual([]);
    });

    it("should handle daylight saving time end", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 11,
        day: 1,
        hour: 1,
      });
      expect(possibleAbsolutes(date, "America/Los_Angeles")).toEqual([
        new Date("2020-11-01T08:00:00.000Z").getTime(),
        new Date("2020-11-01T09:00:00.000Z").getTime(),
      ]);
    });
  });

  describe("fromAbsolute", function () {
    it("should convert a date from absolute using a timezone", function () {
      let date = fromAbsolute(
        new Date("2020-02-03T10:00Z").getTime(),
        "America/Los_Angeles"
      );
      expect(date).toEqual(
        createZonedDateTime({
          year: 2020,
          month: 2,
          day: 3,
          timezone: "America/Los_Angeles",
          offset: -28800000,
          hour: 2,
        })
      );

      date = fromAbsolute(
        new Date("2020-02-03T10:00Z").getTime(),
        "America/New_York"
      );
      expect(date).toEqual(
        createZonedDateTime({
          year: 2020,
          month: 2,
          day: 3,
          timezone: "America/New_York",
          offset: -18000000,
          hour: 5,
        })
      );
    });
  });

  describe("toCalendar", function () {
    it("should support converting a CalendarDateTime between calendars", function () {
      const date = createCalendarDateTime({
        calendar: CALENDAR.JAPANESE,
        era: "heisei",
        year: 31,
        month: 4,
        day: 30,
        hour: 8,
        minute: 20,
        second: 30,
        millisecond: 80,
      });
      expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
        createCalendarDateTime({
          year: 2019,
          month: 4,
          day: 30,
          hour: 8,
          minute: 20,
          second: 30,
          millisecond: 80,
        })
      );
    });

    it("should round trip to the same date in gregorian", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 1 });
      expect(
        calendars[date.calendar].fromJulianDay(
          calendars[date.calendar].toJulianDay(date)
        )
      ).toEqual(createCalendarDate({ year: 2020, month: 9, day: 1 }));
    });

    describe("japanese", function () {
      it("japanese to gregorian", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 31,
          month: 4,
          day: 30,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2019, month: 4, day: 30 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "reiwa",
          year: 2,
          month: 4,
          day: 30,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 4, day: 30 })
        );
      });

      it("gregorian to japanese", function () {
        let date = createCalendarDate({ year: 2019, month: 4, day: 30 });
        expect(toCalendar(date, CALENDAR.JAPANESE)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 31,
            month: 4,
            day: 30,
          })
        );

        date = createCalendarDate({ year: 2020, month: 4, day: 30 });
        expect(toCalendar(date, CALENDAR.JAPANESE)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 2,
            month: 4,
            day: 30,
          })
        );
      });

      it("returns the correct number of days for leap and non-leap years", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "reiwa",
          year: 4,
          month: 2,
          day: 5,
        });
        expect(calendars[date.calendar].getDaysInMonth(date)).toBe(28);

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "reiwa",
          year: 2,
          month: 2,
          day: 5,
        });
        expect(calendars[date.calendar].getDaysInMonth(date)).toBe(29);
      });

      it("constrains dates outside supported eras", function () {
        const date = createCalendarDate({ year: 1700, month: 4, day: 30 });
        expect(toCalendar(date, CALENDAR.JAPANESE)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "meiji",
            year: 1,
            month: 9,
            day: 30,
          })
        );
      });
    });

    describe("taiwan", function () {
      it("taiwan to gregorian", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "minguo",
          year: 109,
          month: 2,
          day: 3,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        );
      });

      it("gregorian to taiwan", function () {
        const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
        expect(toCalendar(date, CALENDAR.TAIWAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "minguo",
            year: 109,
            month: 2,
            day: 3,
          })
        );
      });

      it("taiwan to gregorian at era boundaries", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "minguo",
          year: 1,
          month: 1,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 1912, month: 1, day: 1 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 1,
          month: 1,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 1911, month: 1, day: 1 })
        );
      });

      it("gregorian to taiwan at era boundaries", function () {
        let date = createCalendarDate({ year: 1912, month: 1, day: 1 });
        expect(toCalendar(date, CALENDAR.TAIWAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "minguo",
            year: 1,
            month: 1,
            day: 1,
          })
        );

        date = createCalendarDate({ year: 1911, month: 1, day: 1 });
        expect(toCalendar(date, CALENDAR.TAIWAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 1,
            month: 1,
            day: 1,
          })
        );
      });

      it("handles BC dates", function () {
        let date = createCalendarDate({ era: "BC", year: 2, month: 1, day: 1 });
        expect(toCalendar(date, CALENDAR.TAIWAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 1913,
            month: 1,
            day: 1,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 1913,
          month: 1,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ era: "BC", year: 2, month: 1, day: 1 })
        );
      });
    });

    describe("buddhist", function () {
      it("buddhist to gregorian", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.BUDDHIST,
          year: 2563,
          month: 4,
          day: 30,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 4, day: 30 })
        );
      });

      it("gregorian to buddhist", function () {
        const date = createCalendarDate({ year: 2020, month: 4, day: 30 });
        expect(toCalendar(date, CALENDAR.BUDDHIST)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.BUDDHIST,
            year: 2563,
            month: 4,
            day: 30,
          })
        );
      });

      it("handles BC dates", function () {
        let date = createCalendarDate({ era: "BC", year: 2, month: 1, day: 1 });
        expect(toCalendar(date, CALENDAR.BUDDHIST)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.BUDDHIST,
            year: 542,
            month: 1,
            day: 1,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.BUDDHIST,
          year: 542,
          month: 1,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ era: "BC", year: 2, month: 1, day: 1 })
        );
      });
    });

    describe("indian", function () {
      it("indian to gregorian", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.INDIAN,
          year: 1941,
          month: 4,
          day: 30,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2019, month: 7, day: 21 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.INDIAN,
          year: 1941,
          month: 1,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2019, month: 3, day: 22 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.INDIAN,
          year: 1941,
          month: 9,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2019, month: 11, day: 22 })
        );
      });

      it("indian to gregorian in a leap year", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.INDIAN,
          year: 1942,
          month: 4,
          day: 30,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 7, day: 21 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.INDIAN,
          year: 1942,
          month: 1,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 3, day: 21 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.INDIAN,
          year: 1942,
          month: 9,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 11, day: 22 })
        );
      });

      it("gregorian to indian", function () {
        let date = createCalendarDate({ year: 2019, month: 7, day: 21 });
        expect(toCalendar(date, CALENDAR.INDIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1941,
            month: 4,
            day: 30,
          })
        );

        date = createCalendarDate({ year: 2019, month: 1, day: 22 });
        expect(toCalendar(date, CALENDAR.INDIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1940,
            month: 11,
            day: 2,
          })
        );

        date = createCalendarDate({ year: 2019, month: 3, day: 22 });
        expect(toCalendar(date, CALENDAR.INDIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1941,
            month: 1,
            day: 1,
          })
        );

        date = createCalendarDate({ year: 2019, month: 11, day: 22 });
        expect(toCalendar(date, CALENDAR.INDIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1941,
            month: 9,
            day: 1,
          })
        );
      });

      it("gregorian to indian in a leap year", function () {
        let date = createCalendarDate({ year: 2020, month: 7, day: 21 });
        expect(toCalendar(date, CALENDAR.INDIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1942,
            month: 4,
            day: 30,
          })
        );

        date = createCalendarDate({ year: 2021, month: 1, day: 22 });
        expect(toCalendar(date, CALENDAR.INDIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1942,
            month: 11,
            day: 2,
          })
        );

        date = createCalendarDate({ year: 2020, month: 3, day: 21 });
        expect(toCalendar(date, CALENDAR.INDIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1942,
            month: 1,
            day: 1,
          })
        );

        date = createCalendarDate({ year: 2020, month: 11, day: 22 });
        expect(toCalendar(date, CALENDAR.INDIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1942,
            month: 9,
            day: 1,
          })
        );
      });
    });

    describe("islamic-civil", function () {
      it("islamic-civil to gregorian", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_CIVIL,
          year: 1442,
          month: 2,
          day: 4,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 9, day: 22 })
        );
      });

      it("gregorian to islamic-civil", function () {
        const date = createCalendarDate({ year: 2020, month: 9, day: 22 });
        expect(toCalendar(date, CALENDAR.ISLAMIC_CIVIL)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_CIVIL,
            year: 1442,
            month: 2,
            day: 4,
          })
        );
      });
    });

    describe("islamic-tbla", function () {
      it("islamic-tbla to gregorian", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_TABULAR,
          year: 1442,
          month: 2,
          day: 4,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 9, day: 21 })
        );
      });

      it("gregorian to islamic-tbla", function () {
        const date = createCalendarDate({ year: 2020, month: 9, day: 21 });
        expect(toCalendar(date, CALENDAR.ISLAMIC_TABULAR)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_TABULAR,
            year: 1442,
            month: 2,
            day: 4,
          })
        );
      });
    });

    describe("islamic-umalqura", function () {
      it("islamic-umalqura to gregorian", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_UMALQURA,
          year: 1442,
          month: 9,
          day: 4,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2021, month: 4, day: 16 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_UMALQURA,
          year: 1600,
          month: 9,
          day: 4,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2174, month: 8, day: 2 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_UMALQURA,
          year: 1601,
          month: 9,
          day: 4,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2175, month: 7, day: 23 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_UMALQURA,
          year: 1200,
          month: 9,
          day: 4,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 1786, month: 7, day: 1 })
        );
      });

      it("gregorian to islamic-umalqura", function () {
        let date = createCalendarDate({ year: 2021, month: 4, day: 16 });
        expect(toCalendar(date, CALENDAR.ISLAMIC_UMALQURA)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_UMALQURA,
            year: 1442,
            month: 9,
            day: 4,
          })
        );

        date = createCalendarDate({ year: 2174, month: 8, day: 2 });
        expect(toCalendar(date, CALENDAR.ISLAMIC_UMALQURA)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_UMALQURA,
            year: 1600,
            month: 9,
            day: 4,
          })
        );

        date = createCalendarDate({ year: 2175, month: 7, day: 23 });
        expect(toCalendar(date, CALENDAR.ISLAMIC_UMALQURA)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_UMALQURA,
            year: 1601,
            month: 9,
            day: 4,
          })
        );

        date = createCalendarDate({ year: 1786, month: 7, day: 1 });
        expect(toCalendar(date, CALENDAR.ISLAMIC_UMALQURA)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_UMALQURA,
            year: 1200,
            month: 9,
            day: 4,
          })
        );
      });
    });

    describe("persian", function () {
      it("persian to gregorian", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.PERSIAN,
          year: 1399,
          month: 6,
          day: 12,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 9, day: 2 })
        );
      });

      it("gregorian to persian", function () {
        const date = createCalendarDate({ year: 2020, month: 9, day: 2 });
        expect(toCalendar(date, CALENDAR.PERSIAN)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.PERSIAN,
            year: 1399,
            month: 6,
            day: 12,
          })
        );
      });
    });

    describe("hebrew", function () {
      it("hebrew to gregorian", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5781,
          month: 1,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2020, month: 9, day: 19 })
        );
      });

      it("hebrew to gregorian in a leap year", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5782,
          month: 6,
          day: 1,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 2022, month: 2, day: 2 })
        );
      });

      it("gregorian to hebrew", function () {
        const date = createCalendarDate({ year: 2020, month: 9, day: 19 });
        expect(toCalendar(date, CALENDAR.HEBREW)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5781,
            month: 1,
            day: 1,
          })
        );
      });

      it("gregorian to hebrew in a leap year", function () {
        const date = createCalendarDate({ year: 2022, month: 2, day: 2 });
        expect(toCalendar(date, CALENDAR.HEBREW)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5782,
            month: 6,
            day: 1,
          })
        );
      });
    });

    describe("ethiopic", function () {
      it("ethiopic to gregorian", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.ETHIOPIC,
          era: "AA",
          year: 9999,
          month: 13,
          day: 5,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 4507, month: 9, day: 29 })
        );

        date = createCalendarDate({
          calendar: CALENDAR.ETHIOPIC,
          era: "AM",
          year: 9991,
          month: 13,
          day: 5,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 9999, month: 11, day: 9 })
        );
      });

      it("gregorian to ethioaa", function () {
        let date = createCalendarDate({ year: 4507, month: 9, day: 29 });
        expect(toCalendar(date, CALENDAR.ETHIOPIC)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ETHIOPIC,
            era: "AM",
            year: 4499,
            month: 13,
            day: 5,
          })
        );

        date = createCalendarDate({ year: 1, month: 9, day: 29 });
        expect(toCalendar(date, CALENDAR.ETHIOPIC)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ETHIOPIC,
            era: "AA",
            year: 5494,
            month: 2,
            day: 4,
          })
        );

        date = createCalendarDate({ era: "BC", year: 1200, month: 9, day: 29 });
        expect(toCalendar(date, CALENDAR.ETHIOPIC)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ETHIOPIC,
            era: "AA",
            year: 4294,
            month: 2,
            day: 13,
          })
        );
      });
    });

    describe("ethioaa", function () {
      it("ethioaa to gregorian", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ETHIOPIC_AMETE_ALEM,
          year: 9999,
          month: 13,
          day: 5,
        });
        expect(toCalendar(date, CALENDAR.GREGORIAN)).toEqual(
          createCalendarDate({ year: 4507, month: 9, day: 29 })
        );
      });

      it("gregorian to ethioaa", function () {
        const date = createCalendarDate({ year: 4507, month: 9, day: 29 });
        expect(toCalendar(date, CALENDAR.ETHIOPIC_AMETE_ALEM)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ETHIOPIC_AMETE_ALEM,
            year: 9999,
            month: 13,
            day: 5,
          })
        );
      });
    });
  });

  describe("toCalendarDate", function () {
    it("should convert a CalendarDateTime to a CalendarDate", function () {
      const dateTime = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 8,
        minute: 23,
        second: 10,
        millisecond: 80,
      });
      expect(toCalendarDate(dateTime)).toEqual(
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      );
    });

    it("should preserve calendar", function () {
      const dateTime = createCalendarDateTime({
        calendar: CALENDAR.TAIWAN,
        year: 1912,
        month: 2,
        day: 3,
        hour: 8,
        minute: 23,
        second: 10,
        millisecond: 80,
      });
      expect(toCalendarDate(dateTime)).toEqual(
        createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          year: 1912,
          month: 2,
          day: 3,
        })
      );
    });
  });

  describe("toCalendarDateTime", function () {
    it("should convert a CalendarDate to a CalendarDateTime", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(toCalendarDateTime(date)).toEqual(
        createCalendarDateTime({ year: 2020, month: 2, day: 3 })
      );
    });

    it("should preserve calendar", function () {
      const date = createCalendarDate({
        calendar: CALENDAR.TAIWAN,
        year: 1912,
        month: 2,
        day: 3,
      });
      expect(toCalendarDateTime(date)).toEqual(
        createCalendarDateTime({
          calendar: CALENDAR.TAIWAN,
          year: 1912,
          month: 2,
          day: 3,
        })
      );
    });

    it("should return the same instance if it is already a CalendarDateTime", function () {
      const dateTime = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 8,
        minute: 23,
        second: 10,
        millisecond: 80,
      });
      expect(toCalendarDateTime(dateTime)).toBe(dateTime);
    });

    it("should combine a CalendarDate with a Time", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      const time = createTime({
        hour: 8,
        minute: 23,
        second: 10,
        millisecond: 80,
      });
      expect(toCalendarDateTime(date, time)).toEqual(
        createCalendarDateTime({
          year: 2020,
          month: 2,
          day: 3,
          hour: 8,
          minute: 23,
          second: 10,
          millisecond: 80,
        })
      );
    });

    it("should combine a CalendarDate with a Time and preserve calendar", function () {
      const date = createCalendarDate({
        calendar: CALENDAR.TAIWAN,
        year: 1912,
        month: 2,
        day: 3,
      });
      const time = createTime({
        hour: 8,
        minute: 23,
        second: 10,
        millisecond: 80,
      });
      expect(toCalendarDateTime(date, time)).toEqual(
        createCalendarDateTime({
          calendar: CALENDAR.TAIWAN,
          year: 1912,
          month: 2,
          day: 3,
          hour: 8,
          minute: 23,
          second: 10,
          millisecond: 80,
        })
      );
    });

    it("should override the time of an existing CalendarDateTime", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 10,
        minute: 11,
        second: 50,
        millisecond: 80,
      });
      const time = createTime({
        hour: 8,
        minute: 23,
        second: 10,
        millisecond: 80,
      });
      expect(toCalendarDateTime(date, time)).toEqual(
        createCalendarDateTime({
          year: 2020,
          month: 2,
          day: 3,
          hour: 8,
          minute: 23,
          second: 10,
          millisecond: 80,
        })
      );
    });
  });

  describe("toTime", function () {
    it("should convert a CalendarDateTime to a Time", function () {
      const dateTime = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 8,
        minute: 23,
        second: 10,
        millisecond: 80,
      });
      expect(toTime(dateTime)).toEqual(
        createTime({ hour: 8, minute: 23, second: 10, millisecond: 80 })
      );
    });
  });
});
