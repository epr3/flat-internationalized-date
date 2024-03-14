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

import { toZoned } from "../src";
import { describe, it, expect } from "vitest";
import { createCalendarDateTime } from "../src/CalendarDate";
import { add, cycle, set, subtract } from "../src/manipulation";

describe("ZonedDateTime", function () {
  describe("add", function () {
    describe("should handle forward timezone transitions", function () {
      it("should add hours across forward timezone transitions", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 1 }),
          "America/Los_Angeles"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(add(zoned, { hours: 1 })).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 1 }),
          "America/Los_Angeles"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 4 }),
          "America/Los_Angeles"
        );
        expect(add(zoned, { hours: 2 })).toEqual(expected);
      });

      it("should subtract hours across forward timezone transitions", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 1 }),
          "America/Los_Angeles"
        );
        expect(subtract(zoned, { hours: 1 })).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 4 }),
          "America/Los_Angeles"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 1 }),
          "America/Los_Angeles"
        );
        expect(subtract(zoned, { hours: 2 })).toEqual(expected);
      });

      it("should add across forward timezone transitions at midnight", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2018, month: 11, day: 3, hour: 23 }),
          "America/Sao_Paulo"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 1 }),
          "America/Sao_Paulo"
        );
        expect(add(zoned, { hours: 1 })).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2018, month: 11, day: 3, hour: 23 }),
          "America/Sao_Paulo"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 2 }),
          "America/Sao_Paulo"
        );
        expect(add(zoned, { hours: 2 })).toEqual(expected);
      });

      it("should add across forward timezone transitions at midnight", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 1 }),
          "America/Sao_Paulo"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2018, month: 11, day: 3, hour: 23 }),
          "America/Sao_Paulo"
        );
        expect(subtract(zoned, { hours: 1 })).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 1 }),
          "America/Sao_Paulo"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2018, month: 11, day: 3, hour: 22 }),
          "America/Sao_Paulo"
        );
        expect(subtract(zoned, { hours: 2 })).toEqual(expected);
      });

      it("should add days and adjust hours", function () {
        const zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 13, hour: 2 }),
          "America/Los_Angeles"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(add(zoned, { days: 1 })).toEqual(expected);
      });

      it("should subtract days and adjust hours", function () {
        const zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 15, hour: 2 }),
          "America/Los_Angeles"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(subtract(zoned, { days: 1 })).toEqual(expected);
      });

      it("should add months and adjust hours", function () {
        const zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 2, day: 14, hour: 2 }),
          "America/Los_Angeles"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(add(zoned, { months: 1 })).toEqual(expected);
      });

      it("should subtract months and adjust hours", function () {
        const zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 4, day: 14, hour: 2 }),
          "America/Los_Angeles"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(subtract(zoned, { months: 1 })).toEqual(expected);
      });

      it("should add years and adjust hours", function () {
        const zoned = toZoned(
          createCalendarDateTime({ year: 2020, month: 3, day: 14, hour: 2 }),
          "America/Los_Angeles"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(add(zoned, { years: 1 })).toEqual(expected);
      });

      it("should subtract years and adjust hours", function () {
        const zoned = toZoned(
          createCalendarDateTime({ year: 2022, month: 3, day: 14, hour: 2 }),
          "America/Los_Angeles"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(subtract(zoned, { years: 1 })).toEqual(expected);
      });
    });

    describe("should handle backward timezone transitions", function () {
      it("should add hours across backward timezone transitions", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "earlier"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "later"
        );
        expect(add(zoned, { hours: 1 })).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "earlier"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 2 }),
          "America/Los_Angeles"
        );
        expect(add(zoned, { hours: 2 })).toEqual(expected);
      });

      it("should subtract hours across backward timezone transitions", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "later"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "earlier"
        );
        expect(subtract(zoned, { hours: 1 })).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "later"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 0 }),
          "America/Los_Angeles"
        );
        expect(subtract(zoned, { hours: 2 })).toEqual(expected);
      });

      it("should add across backward timezone transitions at midnight", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "earlier"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "later"
        );
        expect(add(zoned, { hours: 1 })).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "earlier"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 17, hour: 0 }),
          "America/Sao_Paulo"
        );
        expect(add(zoned, { hours: 2 })).toEqual(expected);
      });

      it("should subtract across backward timezone transitions at midnight", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "later"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "earlier"
        );
        expect(subtract(zoned, { hours: 1 })).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 17, hour: 0 }),
          "America/Sao_Paulo",
          "later"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo"
        );
        expect(subtract(zoned, { hours: 2 })).toEqual(expected);
      });
    });
  });

  describe("cycle", function () {
    describe("should handle forward timezone transitions", function () {
      it("forward", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 1 }),
          "America/Los_Angeles"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(cycle(zoned, "hour", 1)).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 13, hour: 2 }),
          "America/Los_Angeles"
        );
        expect(cycle(zoned, "day", 1)).toEqual(expected);
      });

      it("reverse", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 1 }),
          "America/Los_Angeles"
        );
        expect(cycle(zoned, "hour", -1)).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 15, hour: 2 }),
          "America/Los_Angeles"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
          "America/Los_Angeles"
        );
        expect(cycle(zoned, "day", -1)).toEqual(expected);
      });
    });

    describe("should handle backward timezone transitions", function () {
      it("forward", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "earlier"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "later"
        );
        expect(cycle(zoned, "hour", 1)).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 6, hour: 1 }),
          "America/Los_Angeles"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "earlier"
        );
        expect(cycle(zoned, "day", 1)).toEqual(expected);
      });

      it("reverse", function () {
        let zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "later"
        );
        let expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "earlier"
        );
        expect(cycle(zoned, "hour", -1)).toEqual(expected);

        zoned = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 8, hour: 1 }),
          "America/Los_Angeles"
        );
        expected = toZoned(
          createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
          "America/Los_Angeles",
          "earlier"
        );
        expect(cycle(zoned, "day", -1)).toEqual(expected);
      });
    });

    describe("should handle forward timezone transitions at midnight", function () {
      describe("24 hour time", function () {
        it("forward", function () {
          const zoned = toZoned(
            createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 23 }),
            "America/Sao_Paulo"
          );
          const expected = toZoned(
            createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 1 }),
            "America/Sao_Paulo"
          );
          expect(cycle(zoned, "hour", 1)).toEqual(expected);
        });

        it("reverse", function () {
          const zoned = toZoned(
            createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 1 }),
            "America/Sao_Paulo"
          );
          const expected = toZoned(
            createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 23 }),
            "America/Sao_Paulo"
          );
          expect(cycle(zoned, "hour", -1)).toEqual(expected);
        });
      });

      describe("12 hour time", function () {
        it("forward", function () {
          const zoned = toZoned(
            createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 23 }),
            "America/Sao_Paulo"
          );
          const expected = toZoned(
            createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 12 }),
            "America/Sao_Paulo"
          );
          expect(cycle(zoned, "hour", 1, { hourCycle: 12 })).toEqual(expected);
        });

        it("reverse", function () {
          const zoned = toZoned(
            createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 12 }),
            "America/Sao_Paulo"
          );
          const expected = toZoned(
            createCalendarDateTime({ year: 2018, month: 11, day: 4, hour: 23 }),
            "America/Sao_Paulo"
          );
          expect(cycle(zoned, "hour", -1, { hourCycle: 12 })).toEqual(expected);
        });
      });
    });

    describe("should handle backward timezone transitions at midnight", function () {
      it("forward", function () {
        const zoned = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "earlier"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "later"
        );
        expect(cycle(zoned, "hour", 1)).toEqual(expected);
      });

      it("reverse", function () {
        const zoned = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "later"
        );
        const expected = toZoned(
          createCalendarDateTime({ year: 2019, month: 2, day: 16, hour: 23 }),
          "America/Sao_Paulo",
          "earlier"
        );
        expect(cycle(zoned, "hour", -1)).toEqual(expected);
      });
    });
  });

  describe("set", function () {
    it("should preserve wall time when changing the date", function () {
      const zoned = toZoned(
        createCalendarDateTime({ year: 2021, month: 2, day: 14, hour: 4 }),
        "America/Los_Angeles"
      );
      const expected = toZoned(
        createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 4 }),
        "America/Los_Angeles"
      );
      expect(zoned.offset).not.toBe(expected.offset);
      expect(set(zoned, { month: 3 })).toEqual(expected);
    });

    it("should move time forward during forward DST transitions if time does not exist", function () {
      const zoned = toZoned(
        createCalendarDateTime({ year: 2021, month: 2, day: 14, hour: 2 }),
        "America/Los_Angeles"
      );
      const expected = toZoned(
        createCalendarDateTime({ year: 2021, month: 3, day: 14, hour: 3 }),
        "America/Los_Angeles"
      );
      expect(zoned.offset).not.toBe(expected.offset);
      expect(set(zoned, { month: 3 })).toEqual(expected);
    });

    it("should preserve the offset if setting identical fields", function () {
      const zoned = toZoned(
        createCalendarDateTime({ year: 2021, month: 11, day: 7, hour: 1 }),
        "America/Los_Angeles",
        "later"
      );
      expect(set(zoned, { hour: 1 })).toStrictEqual(zoned);
    });
  });
});
