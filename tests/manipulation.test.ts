/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  CALENDAR,
  add,
  cycle,
  set,
  subtract,
  createCalendarDate,
  createCalendarDateTime,
  createZonedDateTime,
} from "..";

import { describe, it, expect } from "vitest";

describe("CalendarDate manipulation", function () {
  describe("add", function () {
    it("should add years", function () {
      const date = createCalendarDate({ year: 2020, month: 1, day: 1 });
      expect(add(date, { years: 5 })).toEqual(
        createCalendarDate({ year: 2025, month: 1, day: 1 })
      );
    });

    it("should add months", function () {
      const date = createCalendarDate({ year: 2020, month: 1, day: 1 });
      expect(add(date, { months: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 6, day: 1 })
      );
    });

    it("should add months across years", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 1 });
      expect(add(date, { months: 5 })).toEqual(
        createCalendarDate({ year: 2021, month: 2, day: 1 })
      );
    });

    it("should add months across multiple years", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 1 });
      expect(add(date, { months: 17 })).toEqual(
        createCalendarDate({ year: 2022, month: 2, day: 1 })
      );
    });

    it("should add months and constrain days", function () {
      const date = createCalendarDate({ year: 2020, month: 8, day: 31 });
      expect(add(date, { months: 1 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 30 })
      );
    });

    it("should add days", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 1 });
      expect(add(date, { days: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 6 })
      );
    });

    it("should add days across months", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 20 });
      expect(add(date, { days: 15 })).toEqual(
        createCalendarDate({ year: 2020, month: 10, day: 5 })
      );
    });

    it("should add days across multiple months", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 20 });
      expect(add(date, { days: 46 })).toEqual(
        createCalendarDate({ year: 2020, month: 11, day: 5 })
      );
    });

    it("should add days across years", function () {
      const date = createCalendarDate({ year: 2020, month: 12, day: 20 });
      expect(add(date, { days: 15 })).toEqual(
        createCalendarDate({ year: 2021, month: 1, day: 4 })
      );
    });

    it("should add days across multiple years", function () {
      const date = createCalendarDate({ year: 2020, month: 12, day: 20 });
      expect(add(date, { days: 380 })).toEqual(
        createCalendarDate({ year: 2022, month: 1, day: 4 })
      );
    });

    it("should handle leap years", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 28 });
      expect(add(date, { days: 1 })).toEqual(
        createCalendarDate({ year: 2020, month: 2, day: 29 })
      );
      expect(add(date, { days: 2 })).toEqual(
        createCalendarDate({ year: 2020, month: 3, day: 1 })
      );
    });

    it("should handle non-leap years", function () {
      const date = createCalendarDate({ year: 2019, month: 2, day: 28 });
      expect(add(date, { days: 1 })).toEqual(
        createCalendarDate({ year: 2019, month: 3, day: 1 })
      );
    });

    it("should add weeks", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 1 });
      expect(add(date, { weeks: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 10, day: 6 })
      );
    });

    it("should add years, months, and days together", function () {
      const date = createCalendarDate({ year: 2020, month: 10, day: 25 });
      expect(add(date, { years: 2, months: 3, days: 10 })).toEqual(
        createCalendarDate({ year: 2023, month: 2, day: 4 })
      );
    });

    it("should ignore time when adding to a date", function () {
      const date = createCalendarDate({ year: 2020, month: 10, day: 25 });
      expect(add(date, { hours: 36 })).toEqual(date);
      expect(add(date, { minutes: 500 })).toEqual(date);
      expect(add(date, { seconds: 5000000 })).toEqual(date);
      expect(add(date, { milliseconds: 50000000000 })).toEqual(date);
    });

    it("should add in BC", function () {
      const date = createCalendarDate({
        era: "BC",
        year: 10,
        month: 9,
        day: 3,
      });
      expect(add(date, { years: 1 })).toEqual(
        createCalendarDate({ era: "BC", year: 9, month: 9, day: 3 })
      );
    });

    it("should add between BC and AD", function () {
      let date = createCalendarDate({ era: "BC", year: 1, month: 9, day: 3 });
      expect(add(date, { years: 1 })).toEqual(
        createCalendarDate({ year: 1, month: 9, day: 3 })
      );

      date = createCalendarDate({ era: "BC", year: 11, month: 9, day: 3 });
      expect(add(date, { years: 20 })).toEqual(
        createCalendarDate({ year: 10, month: 9, day: 3 })
      );
    });

    it("should constrain when hitting the maximum year", function () {
      const date = createCalendarDate({ year: 9999, month: 12, day: 1 });
      expect(add(date, { months: 1 })).toEqual(
        createCalendarDate({ year: 9999, month: 12, day: 31 })
      );
    });

    it("should constrain when hitting the minimum year", function () {
      const date = createCalendarDate({
        era: "BC",
        year: 9999,
        month: 1,
        day: 12,
      });
      expect(subtract(date, { months: 1 })).toEqual(
        createCalendarDate({ era: "BC", year: 9999, month: 1, day: 1 })
      );
    });

    describe("Japanese calendar", function () {
      it("should add years and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 31,
          month: 4,
          day: 30,
        });
        expect(add(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 2,
            month: 4,
            day: 30,
          })
        );
      });

      it("should add months and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 31,
          month: 4,
          day: 30,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 1,
            month: 5,
            day: 30,
          })
        );
      });

      it("should add days and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 31,
          month: 4,
          day: 30,
        });
        expect(add(date, { days: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 1,
            month: 5,
            day: 1,
          })
        );
      });

      it("should contstrain when reaching begining of meiji era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "meiji",
          year: 1,
          month: 10,
          day: 1,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "meiji",
            year: 1,
            month: 9,
            day: 8,
          })
        );
      });

      it("should constrain when reaching 7981 reiwa", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "reiwa",
          year: 7981,
          month: 12,
          day: 5,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 7981,
            month: 12,
            day: 31,
          })
        );
      });
    });

    describe("Taiwan calendar", function () {
      it("should add years and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 1,
          month: 4,
          day: 30,
        });
        expect(add(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "minguo",
            year: 1,
            month: 4,
            day: 30,
          })
        );
      });

      it("should add years in before_minguo era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 3,
          month: 4,
          day: 30,
        });
        expect(add(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 2,
            month: 4,
            day: 30,
          })
        );
      });

      it("should add months and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 1,
          month: 12,
          day: 30,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "minguo",
            year: 1,
            month: 1,
            day: 30,
          })
        );
      });

      it("should add days and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 1,
          month: 12,
          day: 31,
        });
        expect(add(date, { days: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "minguo",
            year: 1,
            month: 1,
            day: 1,
          })
        );
      });

      it("should constrain when reaching year 8088", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          year: 8088,
          month: 12,
          day: 10,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            year: 8088,
            month: 12,
            day: 31,
          })
        );
      });

      it("should constrain when reaching year 8088 before minguo", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 9999,
          month: 1,
          day: 10,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 9999,
            month: 1,
            day: 1,
          })
        );
      });
    });

    describe("Hebrew calendar", function () {
      it("should add months in a non-leap year", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5781,
          month: 5,
          day: 1,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5781,
            month: 6,
            day: 1,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5781,
          month: 12,
          day: 1,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5782,
            month: 1,
            day: 1,
          })
        );
      });

      it("should add months in a leap year", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5782,
          month: 5,
          day: 1,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5782,
            month: 6,
            day: 1,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5782,
          month: 12,
          day: 1,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5782,
            month: 13,
            day: 1,
          })
        );
      });

      it("should add years in a leap year", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5782,
          month: 13,
          day: 1,
        });
        expect(add(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5783,
            month: 12,
            day: 1,
          })
        );
      });

      it("should constrain when reaching year 1", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 1,
          month: 1,
          day: 10,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 1,
            month: 1,
            day: 1,
          })
        );
      });

      it("should constrain when reaching year 9999", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 9999,
          month: 12,
          day: 10,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 9999,
            month: 12,
            day: 29,
          })
        );
      });
    });

    describe("IndianCalendar", function () {
      it("should constrain when reaching year 1", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.INDIAN,
          year: 1,
          month: 1,
          day: 10,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 1,
            month: 1,
            day: 1,
          })
        );
      });

      it("should constrain when reaching year 9919", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.INDIAN,
          year: 9919,
          month: 12,
          day: 10,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.INDIAN,
            year: 9919,
            month: 12,
            day: 31,
          })
        );
      });
    });

    describe("PersianCalendar", function () {
      it("should constrain when reaching year 1", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.PERSIAN,
          year: 1,
          month: 1,
          day: 10,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.PERSIAN,
            year: 1,
            month: 1,
            day: 1,
          })
        );
      });

      it("should constrain when reaching year 3177", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.PERSIAN,
          year: 3178,
          month: 12,
          day: 10,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.PERSIAN,
            year: 3178,
            month: 12,
            day: 31,
          })
        );
      });
    });

    describe("BuddhistCalendar", function () {
      it("should constrain when reaching year 1", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.BUDDHIST,
          year: 1,
          month: 1,
          day: 12,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.BUDDHIST,
            year: 1,
            month: 1,
            day: 1,
          })
        );
      });

      it("should constrain when reaching year 9999", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.BUDDHIST,
          year: 9999,
          month: 12,
          day: 10,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.BUDDHIST,
            year: 9999,
            month: 12,
            day: 31,
          })
        );
      });
    });

    describe("CopticCalendar", function () {
      it("should rebalance era when subtracting", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.COPTIC,
          year: 1,
          month: 1,
          day: 12,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.COPTIC,
            era: "BCE",
            year: 1,
            month: 13,
            day: 5,
          })
        );
      });

      it("should rebalance era when adding", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.COPTIC,
          era: "BCE",
          year: 1,
          month: 13,
          day: 5,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.COPTIC,
            year: 1,
            month: 1,
            day: 5,
          })
        );
      });

      it("should constrain when reaching year 9715 CE", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.COPTIC,
          year: 9715,
          month: 13,
          day: 2,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.COPTIC,
            year: 9715,
            month: 13,
            day: 6,
          })
        );
      });

      it("should constrain when reaching year 9999 BCE", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.COPTIC,
          era: "BCE",
          year: 9999,
          month: 1,
          day: 5,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.COPTIC,
            era: "BCE",
            year: 9999,
            month: 1,
            day: 1,
          })
        );
      });
    });

    describe("EthiopicCalendar", function () {
      it("should constrain when reaching year 9991 AM", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ETHIOPIC,
          year: 9991,
          month: 13,
          day: 2,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ETHIOPIC,
            year: 9991,
            month: 13,
            day: 6,
          })
        );
      });

      it("should constrain when reaching year 9999 AA", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ETHIOPIC,
          era: "AA",
          year: 9999,
          month: 13,
          day: 2,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ETHIOPIC,
            era: "AA",
            year: 9999,
            month: 13,
            day: 6,
          })
        );
      });
    });

    describe("EthiopicAmeteAlemCalendar", function () {
      it("should constrain when reaching year 9999 AA", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ETHIOPIC_AMETE_ALEM,
          era: "AA",
          year: 9999,
          month: 13,
          day: 2,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ETHIOPIC_AMETE_ALEM,
            era: "AA",
            year: 9999,
            month: 13,
            day: 6,
          })
        );
      });
    });

    describe("IslamicCivilCalendar", function () {
      it("should constrain when reaching year 9995", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_CIVIL,
          year: 9995,
          month: 12,
          day: 2,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_CIVIL,
            year: 9995,
            month: 12,
            day: 30,
          })
        );
      });
    });

    describe("IslamicTabularCalendar", function () {
      it("should constrain when reaching year 9995", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_TABULAR,
          year: 9995,
          month: 12,
          day: 2,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_TABULAR,
            year: 9995,
            month: 12,
            day: 30,
          })
        );
      });
    });

    describe("IslamicUmalquraCalendar", function () {
      it("should constrain when reaching year 9995", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.ISLAMIC_UMALQURA,
          year: 9995,
          month: 12,
          day: 2,
        });
        expect(add(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.ISLAMIC_UMALQURA,
            year: 9995,
            month: 12,
            day: 30,
          })
        );
      });
    });
  });

  describe("subtract", function () {
    it("should subtract years", function () {
      const date = createCalendarDate({ year: 2025, month: 1, day: 1 });
      expect(subtract(date, { years: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 1, day: 1 })
      );
    });

    it("should subtract months", function () {
      const date = createCalendarDate({ year: 2020, month: 6, day: 1 });
      expect(subtract(date, { months: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 1, day: 1 })
      );
    });

    it("should subtract months across years", function () {
      const date = createCalendarDate({ year: 2021, month: 2, day: 1 });
      expect(subtract(date, { months: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 1 })
      );
    });

    it("should subtract months across multiple years", function () {
      const date = createCalendarDate({ year: 2022, month: 2, day: 1 });
      expect(subtract(date, { months: 17 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 1 })
      );
    });

    it("should subtract months and constrain days", function () {
      const date = createCalendarDate({ year: 2020, month: 10, day: 31 });
      expect(subtract(date, { months: 1 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 30 })
      );
    });

    it("should subtract days", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 6 });
      expect(subtract(date, { days: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 1 })
      );
    });

    it("should subtract days across months", function () {
      const date = createCalendarDate({ year: 2020, month: 10, day: 5 });
      expect(subtract(date, { days: 15 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 20 })
      );
    });

    it("should subtract days across multiple months", function () {
      const date = createCalendarDate({ year: 2020, month: 11, day: 5 });
      expect(subtract(date, { days: 46 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 20 })
      );
    });

    it("should subtract days across years", function () {
      const date = createCalendarDate({ year: 2021, month: 1, day: 4 });
      expect(subtract(date, { days: 15 })).toEqual(
        createCalendarDate({ year: 2020, month: 12, day: 20 })
      );
    });

    it("should subtract days across multiple years", function () {
      const date = createCalendarDate({ year: 2022, month: 1, day: 4 });
      expect(subtract(date, { days: 380 })).toEqual(
        createCalendarDate({ year: 2020, month: 12, day: 20 })
      );
    });

    it("should handle leap years", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 28 });
      expect(
        subtract(createCalendarDate({ year: 2020, month: 2, day: 29 }), {
          days: 1,
        })
      ).toEqual(date);
      expect(
        subtract(createCalendarDate({ year: 2020, month: 3, day: 1 }), {
          days: 2,
        })
      ).toEqual(date);
    });

    it("should handle non-leap years", function () {
      const date = createCalendarDate({ year: 2019, month: 2, day: 28 });
      expect(
        subtract(createCalendarDate({ year: 2019, month: 3, day: 1 }), {
          days: 1,
        })
      ).toEqual(date);
    });

    it("should subtract weeks", function () {
      const date = createCalendarDate({ year: 2020, month: 10, day: 6 });
      expect(subtract(date, { weeks: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 1 })
      );
    });

    it("should ignore time when subtracting from a date", function () {
      const date = createCalendarDate({ year: 2020, month: 10, day: 25 });
      expect(subtract(date, { hours: 36 })).toEqual(date);
      expect(subtract(date, { minutes: 500 })).toEqual(date);
      expect(subtract(date, { seconds: 5000000 })).toEqual(date);
      expect(subtract(date, { milliseconds: 50000000000 })).toEqual(date);
    });

    it("should subtract in BC", function () {
      const date = createCalendarDate({ era: "BC", year: 1, month: 9, day: 3 });
      expect(subtract(date, { years: 1 })).toEqual(
        createCalendarDate({ era: "BC", year: 2, month: 9, day: 3 })
      );
    });

    it("should subtract between AD and BC", function () {
      let date = createCalendarDate({ year: 1, month: 9, day: 3 });
      expect(subtract(date, { years: 1 })).toEqual(
        createCalendarDate({ era: "BC", year: 1, month: 9, day: 3 })
      );

      date = createCalendarDate({ year: 10, month: 9, day: 3 });
      expect(subtract(date, { years: 20 })).toEqual(
        createCalendarDate({ era: "BC", year: 11, month: 9, day: 3 })
      );
    });

    describe("Japanese calendar", function () {
      it("should subtract years and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "reiwa",
          year: 1,
          month: 5,
          day: 30,
        });
        expect(subtract(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 30,
            month: 5,
            day: 30,
          })
        );
      });

      it("should subtract months and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "reiwa",
          year: 1,
          month: 5,
          day: 30,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 31,
            month: 4,
            day: 30,
          })
        );
      });

      it("should subtract days and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "reiwa",
          year: 1,
          month: 5,
          day: 1,
        });
        expect(subtract(date, { days: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 31,
            month: 4,
            day: 30,
          })
        );
      });

      it("should constrain when reaching the minimum supported era", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "meiji",
          year: 1,
          month: 9,
          day: 10,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "meiji",
            year: 1,
            month: 9,
            day: 10,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "meiji",
          year: 1,
          month: 9,
          day: 10,
        });
        expect(subtract(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "meiji",
            year: 1,
            month: 9,
            day: 10,
          })
        );
      });
    });

    describe("Taiwan calendar", function () {
      it("should subtract years and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "minguo",
          year: 1,
          month: 4,
          day: 30,
        });
        expect(subtract(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 1,
            month: 4,
            day: 30,
          })
        );
      });

      it("should subtract years in before_minguo era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 2,
          month: 4,
          day: 30,
        });
        expect(subtract(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 3,
            month: 4,
            day: 30,
          })
        );
      });

      it("should subtract months and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "minguo",
          year: 1,
          month: 1,
          day: 30,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 1,
            month: 12,
            day: 30,
          })
        );
      });

      it("should subtract days and rebalance era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "minguo",
          year: 1,
          month: 1,
          day: 1,
        });
        expect(subtract(date, { days: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 1,
            month: 12,
            day: 31,
          })
        );
      });
    });

    describe("Hebrew calendar", function () {
      it("should subtract months in a non-leap year", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5781,
          month: 6,
          day: 1,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5781,
            month: 5,
            day: 1,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5782,
          month: 1,
          day: 1,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5781,
            month: 12,
            day: 1,
          })
        );
      });

      it("should subtract months in a leap year", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5782,
          month: 6,
          day: 1,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5782,
            month: 5,
            day: 1,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5782,
          month: 13,
          day: 1,
        });
        expect(subtract(date, { months: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5782,
            month: 12,
            day: 1,
          })
        );
      });

      it("should subtract years in a leap year", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.HEBREW,
          year: 5782,
          month: 13,
          day: 1,
        });
        expect(subtract(date, { years: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.HEBREW,
            year: 5781,
            month: 12,
            day: 1,
          })
        );
      });
    });
  });

  describe("set", function () {
    it("should set year", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(set(date, { year: 2022 })).toEqual(
        createCalendarDate({ year: 2022, month: 2, day: 3 })
      );
    });

    it("should set month", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(set(date, { month: 5 })).toEqual(
        createCalendarDate({ year: 2020, month: 5, day: 3 })
      );
    });

    it("should constrain month", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(set(date, { month: 13 })).toEqual(
        createCalendarDate({ year: 2020, month: 12, day: 3 })
      );
    });

    it("should set month and constrain day", function () {
      const date = createCalendarDate({ year: 2020, month: 8, day: 31 });
      expect(set(date, { month: 9 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 30 })
      );
    });

    it("should set day", function () {
      const date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(set(date, { day: 9 })).toEqual(
        createCalendarDate({ year: 2020, month: 2, day: 9 })
      );
    });

    it("should constrain day", function () {
      const date = createCalendarDate({ year: 2020, month: 9, day: 3 });
      expect(set(date, { day: 31 })).toEqual(
        createCalendarDate({ year: 2020, month: 9, day: 30 })
      );
    });

    it("should constrain day on leap years", function () {
      let date = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(set(date, { day: 31 })).toEqual(
        createCalendarDate({ year: 2020, month: 2, day: 29 })
      );

      date = createCalendarDate({ year: 2019, month: 2, day: 3 });
      expect(set(date, { day: 31 })).toEqual(
        createCalendarDate({ year: 2019, month: 2, day: 28 })
      );
    });

    describe("Japanese calendar", function () {
      it("should constrain date in era", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 30,
          month: 4,
          day: 30,
        });
        expect(set(date, { year: 35 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 31,
            month: 4,
            day: 30,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 63,
          month: 1,
          day: 6,
        });
        expect(set(date, { year: 72 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "showa",
            year: 64,
            month: 1,
            day: 6,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 31,
          month: 3,
          day: 30,
        });
        expect(set(date, { month: 5 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 31,
            month: 4,
            day: 30,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 1,
          month: 12,
          day: 30,
        });
        expect(set(date, { month: 5 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "showa",
            year: 1,
            month: 12,
            day: 30,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 64,
          month: 1,
          day: 6,
        });
        expect(set(date, { day: 8 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "showa",
            year: 64,
            month: 1,
            day: 7,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 1,
          month: 12,
          day: 30,
        });
        expect(set(date, { day: 5 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "showa",
            year: 1,
            month: 12,
            day: 25,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "reiwa",
          year: 1,
          month: 12,
          day: 30,
        });
        expect(set(date, { year: 1, month: 1, day: 1 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 1,
            month: 5,
            day: 1,
          })
        );
      });
    });

    describe("Taiwan calendar", function () {
      it("should constrain year in era", function () {
        const date = createCalendarDate({
          calendar: CALENDAR.TAIWAN,
          era: "before_minguo",
          year: 5,
          month: 4,
          day: 30,
        });
        expect(set(date, { year: -2 })).toEqual(
          createCalendarDate({
            calendar: CALENDAR.TAIWAN,
            era: "before_minguo",
            year: 1,
            month: 4,
            day: 30,
          })
        );
      });
    });
  });

  describe("cycle", function () {
    describe("era", function () {
      it("should cycle the era", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 10,
          month: 4,
          day: 30,
        });
        expect(cycle(date, "era", 1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 10,
            month: 4,
            day: 30,
          })
        );
        expect(cycle(date, "era", -1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "showa",
            year: 10,
            month: 4,
            day: 30,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 10,
          month: 4,
          day: 30,
        });
        expect(cycle(date, "era", 2)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 10,
            month: 4,
            day: 30,
          })
        );
        expect(cycle(date, "era", 3)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "meiji",
            year: 10,
            month: 4,
            day: 30,
          })
        );
      });

      it("should constrain the date within the era", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 63,
          month: 1,
          day: 6,
        });
        expect(cycle(date, "era", 1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 31,
            month: 1,
            day: 6,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 63,
          month: 7,
          day: 6,
        });
        expect(cycle(date, "era", 1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 31,
            month: 4,
            day: 6,
          })
        );
      });
    });

    describe("year", function () {
      it("should cycle the year", function () {
        const date = createCalendarDate({ year: 2020, month: 9, day: 3 });
        expect(cycle(date, "year", 1)).toEqual(
          createCalendarDate({ year: 2021, month: 9, day: 3 })
        );
        expect(cycle(date, "year", -1)).toEqual(
          createCalendarDate({ year: 2019, month: 9, day: 3 })
        );
        expect(cycle(date, "year", -5)).toEqual(
          createCalendarDate({ year: 2015, month: 9, day: 3 })
        );
      });
      it("should cycle the month", function () {
        const date = createCalendarDate({ year: 2020, month: 9, day: 3 });
        expect(cycle(date, "month", 1)).toEqual(
          createCalendarDate({ year: 2020, month: 10, day: 3 })
        );
        expect(cycle(date, "month", -1)).toEqual(
          createCalendarDate({ year: 2020, month: 8, day: 3 })
        );
        expect(cycle(date, "month", 4)).toEqual(
          createCalendarDate({ year: 2020, month: 1, day: 3 })
        );
        expect(cycle(date, "month", -10)).toEqual(
          createCalendarDate({ year: 2020, month: 11, day: 3 })
        );
      });

      it("should cycle the month with rounding", function () {
        const date = createCalendarDate({ year: 2020, month: 8, day: 3 });
        expect(cycle(date, "month", 5, { round: true })).toEqual(
          createCalendarDate({ year: 2020, month: 10, day: 3 })
        );
        expect(cycle(date, "month", -5, { round: true })).toEqual(
          createCalendarDate({ year: 2020, month: 5, day: 3 })
        );
      });

      it("should constrain the day", function () {
        let date = createCalendarDate({ year: 2020, month: 1, day: 31 });
        expect(cycle(date, "month", 1)).toEqual(
          createCalendarDate({ year: 2020, month: 2, day: 29 })
        );

        date = createCalendarDate({ year: 2021, month: 1, day: 31 });
        expect(cycle(date, "month", 1)).toEqual(
          createCalendarDate({ year: 2021, month: 2, day: 28 })
        );
      });

      it("should adjust the era", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 31,
          month: 4,
          day: 30,
        });
        expect(cycle(date, "month", 1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 1,
            month: 5,
            day: 30,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 31,
          month: 1,
          day: 30,
        });
        expect(cycle(date, "month", -1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "reiwa",
            year: 1,
            month: 12,
            day: 30,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 1,
          month: 12,
          day: 25,
        });
        expect(cycle(date, "month", 1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "taisho",
            year: 15,
            month: 1,
            day: 25,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 64,
          month: 1,
          day: 7,
        });
        expect(cycle(date, "month", 1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 1,
            month: 2,
            day: 7,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 1,
          month: 2,
          day: 7,
        });
        expect(cycle(date, "month", -1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "showa",
            year: 64,
            month: 1,
            day: 7,
          })
        );
      });
    });

    describe("day", function () {
      it("should cycle the day", function () {
        const date = createCalendarDate({ year: 2020, month: 9, day: 3 });
        expect(cycle(date, "day", 1)).toEqual(
          createCalendarDate({ year: 2020, month: 9, day: 4 })
        );
        expect(cycle(date, "day", -1)).toEqual(
          createCalendarDate({ year: 2020, month: 9, day: 2 })
        );
        expect(cycle(date, "day", 28)).toEqual(
          createCalendarDate({ year: 2020, month: 9, day: 1 })
        );
        expect(cycle(date, "day", -4)).toEqual(
          createCalendarDate({ year: 2020, month: 9, day: 29 })
        );
      });

      it("should cycle the day with rounding", function () {
        const date = createCalendarDate({ year: 2020, month: 8, day: 3 });
        expect(cycle(date, "day", 5, { round: true })).toEqual(
          createCalendarDate({ year: 2020, month: 8, day: 5 })
        );
        expect(cycle(date, "day", -5, { round: true })).toEqual(
          createCalendarDate({ year: 2020, month: 8, day: 1 })
        );
      });

      it("should adjust the era", function () {
        let date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 64,
          month: 1,
          day: 7,
        });
        expect(cycle(date, "day", 1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "heisei",
            year: 1,
            month: 1,
            day: 8,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "heisei",
          year: 1,
          month: 1,
          day: 8,
        });
        expect(cycle(date, "day", -1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "showa",
            year: 64,
            month: 1,
            day: 7,
          })
        );

        date = createCalendarDate({
          calendar: CALENDAR.JAPANESE,
          era: "showa",
          year: 1,
          month: 12,
          day: 25,
        });
        expect(cycle(date, "day", -1)).toEqual(
          createCalendarDate({
            calendar: CALENDAR.JAPANESE,
            era: "taisho",
            year: 15,
            month: 12,
            day: 24,
          })
        );
      });
    });
  });
});

describe("CalendarDateTime manipulation", function () {
  describe("add", function () {
    it.each`
      Unit              | Expected
      ${"years"}        | ${createCalendarDateTime({ year: 2025, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })}
      ${"months"}       | ${createCalendarDateTime({ year: 2020, month: 6, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })}
      ${"weeks"}        | ${createCalendarDateTime({ year: 2020, month: 2, day: 5, hour: 0, minute: 0, second: 0, millisecond: 0 })}
      ${"days"}         | ${createCalendarDateTime({ year: 2020, month: 1, day: 6, hour: 0, minute: 0, second: 0, millisecond: 0 })}
      ${"hours"}        | ${createCalendarDateTime({ year: 2020, month: 1, day: 1, hour: 5, minute: 0, second: 0, millisecond: 0 })}
      ${"minutes"}      | ${createCalendarDateTime({ year: 2020, month: 1, day: 1, hour: 0, minute: 5, second: 0, millisecond: 0 })}
      ${"seconds"}      | ${createCalendarDateTime({ year: 2020, month: 1, day: 1, hour: 0, minute: 0, second: 5, millisecond: 0 })}
      ${"milliseconds"} | ${createCalendarDateTime({ year: 2020, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 5 })}
    `("should add $Unit", ({ Unit, Expected }) => {
      const date = createCalendarDateTime({
        year: 2020,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      expect(add(date, { [`${Unit}`]: 5 })).toEqual(Expected);
    });
  });

  describe("subtract", function () {
    it.each`
      Unit              | Expected
      ${"years"}        | ${createCalendarDateTime({ year: 2015, month: 1, day: 1, hour: 5, minute: 5, second: 5, millisecond: 5 })}
      ${"months"}       | ${createCalendarDateTime({ year: 2019, month: 8, day: 1, hour: 5, minute: 5, second: 5, millisecond: 5 })}
      ${"weeks"}        | ${createCalendarDateTime({ year: 2019, month: 11, day: 27, hour: 5, minute: 5, second: 5, millisecond: 5 })}
      ${"days"}         | ${createCalendarDateTime({ year: 2019, month: 12, day: 27, hour: 5, minute: 5, second: 5, millisecond: 5 })}
      ${"hours"}        | ${createCalendarDateTime({ year: 2020, month: 1, day: 1, hour: 0, minute: 5, second: 5, millisecond: 5 })}
      ${"minutes"}      | ${createCalendarDateTime({ year: 2020, month: 1, day: 1, hour: 5, minute: 0, second: 5, millisecond: 5 })}
      ${"seconds"}      | ${createCalendarDateTime({ year: 2020, month: 1, day: 1, hour: 5, minute: 5, second: 0, millisecond: 5 })}
      ${"milliseconds"} | ${createCalendarDateTime({ year: 2020, month: 1, day: 1, hour: 5, minute: 5, second: 5, millisecond: 0 })}
    `("should subtract $Unit", ({ Unit, Expected }) => {
      const date = createCalendarDateTime({
        year: 2020,
        month: 1,
        day: 1,
        hour: 5,
        minute: 5,
        second: 5,
        millisecond: 5,
      });
      expect(subtract(date, { [`${Unit}`]: 5 })).toEqual(Expected);
    });
  });
});

describe("ZonedDateTime manipulation", function () {
  describe("add", function () {
    it.each`
      Unit              | Expected
      ${"years"}        | ${createZonedDateTime({ year: 2025, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 0, minute: 0, second: 0, millisecond: 0 })}
      ${"months"}       | ${createZonedDateTime({ year: 2020, month: 6, day: 1, timezone: "UTC", offset: 0, hour: 0, minute: 0, second: 0, millisecond: 0 })}
      ${"weeks"}        | ${createZonedDateTime({ year: 2020, month: 2, day: 5, timezone: "UTC", offset: 0, hour: 0, minute: 0, second: 0, millisecond: 0 })}
      ${"days"}         | ${createZonedDateTime({ year: 2020, month: 1, day: 6, timezone: "UTC", offset: 0, hour: 0, minute: 0, second: 0, millisecond: 0 })}
      ${"hours"}        | ${createZonedDateTime({ year: 2020, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 5, minute: 0, second: 0, millisecond: 0 })}
      ${"minutes"}      | ${createZonedDateTime({ year: 2020, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 0, minute: 5, second: 0, millisecond: 0 })}
      ${"seconds"}      | ${createZonedDateTime({ year: 2020, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 0, minute: 0, second: 5, millisecond: 0 })}
      ${"milliseconds"} | ${createZonedDateTime({ year: 2020, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 0, minute: 0, second: 0, millisecond: 5 })}
    `("should add $Unit", ({ Unit, Expected }) => {
      const date = createZonedDateTime({
        year: 2020,
        month: 1,
        day: 1,
        timezone: "UTC",
        offset: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      expect(add(date, { [`${Unit}`]: 5 })).toEqual(Expected);
    });
  });

  describe("subtract", function () {
    it.each`
      Unit              | Expected
      ${"years"}        | ${createZonedDateTime({ year: 2015, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 5, minute: 5, second: 5, millisecond: 5 })}
      ${"months"}       | ${createZonedDateTime({ year: 2019, month: 8, day: 1, timezone: "UTC", offset: 0, hour: 5, minute: 5, second: 5, millisecond: 5 })}
      ${"weeks"}        | ${createZonedDateTime({ year: 2019, month: 11, day: 27, timezone: "UTC", offset: 0, hour: 5, minute: 5, second: 5, millisecond: 5 })}
      ${"days"}         | ${createZonedDateTime({ year: 2019, month: 12, day: 27, timezone: "UTC", offset: 0, hour: 5, minute: 5, second: 5, millisecond: 5 })}
      ${"hours"}        | ${createZonedDateTime({ year: 2020, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 0, minute: 5, second: 5, millisecond: 5 })}
      ${"minutes"}      | ${createZonedDateTime({ year: 2020, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 5, minute: 0, second: 5, millisecond: 5 })}
      ${"seconds"}      | ${createZonedDateTime({ year: 2020, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 5, minute: 5, second: 0, millisecond: 5 })}
      ${"milliseconds"} | ${createZonedDateTime({ year: 2020, month: 1, day: 1, timezone: "UTC", offset: 0, hour: 5, minute: 5, second: 5, millisecond: 0 })}
    `("should subtract $Unit", ({ Unit, Expected }) => {
      const date = createZonedDateTime({
        year: 2020,
        month: 1,
        day: 1,
        timezone: "UTC",
        offset: 0,
        hour: 5,
        minute: 5,
        second: 5,
        millisecond: 5,
      });
      expect(subtract(date, { [`${Unit}`]: 5 })).toEqual(Expected);
    });
  });
});
