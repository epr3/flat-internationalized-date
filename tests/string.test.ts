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
  parseAbsolute,
  parseDate,
  parseDateTime,
  parseDuration,
  parseTime,
  parseZonedDateTime,
  temporalToString,
  toAbsoluteString,
} from "..";

import { describe, it, expect } from "vitest";
import {
  createCalendarDate,
  createCalendarDateTime,
  createTime,
  createZonedDateTime,
} from "../src/CalendarDate";

describe("string conversion", function () {
  describe("parseTime", function () {
    it("should parse a time with only hours", function () {
      const time = parseTime("14");
      const expected = createTime({ hour: 14 });
      expect(time).toEqual(expected);
    });

    it("should parse a padded time with only hours", function () {
      const time = parseTime("04");
      const expected = createTime({ hour: 4 });
      expect(time).toEqual(expected);
    });

    it("should parse a time with hours and minutes", function () {
      const time = parseTime("14:05");
      const expected = createTime({ hour: 14, minute: 5 });
      expect(time).toEqual(expected);
    });

    it("should parse a time with hours, minutes, and seconds", function () {
      const time = parseTime("14:05:25");
      const expected = createTime({ hour: 14, minute: 5, second: 25 });
      expect(time).toEqual(expected);
    });

    it("should parse a time with hours, minutes, seconds, and milliseconds", function () {
      let time = parseTime("14:05:25.1");
      let expected = createTime({
        hour: 14,
        minute: 5,
        second: 25,
        millisecond: 100,
      });
      expect(time).toEqual(expected);

      time = parseTime("14:05:25.12");
      expected = createTime({
        hour: 14,
        minute: 5,
        second: 25,
        millisecond: 120,
      });
      expect(time).toEqual(expected);
    });

    it("should error if time is not padded", function () {
      expect(() => parseTime("1")).toThrow();
      expect(() => parseTime("01:4")).toThrow();
    });

    it("should error if components are out of range", function () {
      expect(() => parseTime("45:23")).toThrow();
      expect(() => parseTime("12:99")).toThrow();
      expect(() => parseTime("12:45:99")).toThrow();
    });
  });

  describe("Time#toString", function () {
    it("should stringify a time", function () {
      const time = createTime({ hour: 14, minute: 45, second: 25 });
      expect(temporalToString(time)).toBe("14:45:25");
    });

    it("should stringify a time with padding", function () {
      const time = createTime({ hour: 4, minute: 5, second: 25 });
      expect(temporalToString(time)).toBe("04:05:25");
    });

    it("should stringify a time milliseconds", function () {
      let time = createTime({
        hour: 4,
        minute: 5,
        second: 25,
        millisecond: 100,
      });
      expect(temporalToString(time)).toBe("04:05:25.1");

      time = createTime({ hour: 4, minute: 5, second: 25, millisecond: 120 });
      expect(temporalToString(time)).toBe("04:05:25.12");
    });
  });

  describe("parseDate", function () {
    it("should parse a date", function () {
      const date = parseDate("2020-02-03");
      const expected = createCalendarDate({ year: 2020, month: 2, day: 3 });
      expect(date).toEqual(expected);
    });

    it("should parse a padded date", function () {
      const date = parseDate("0128-02-03");
      const expected = createCalendarDate({ year: 128, month: 2, day: 3 });
      expect(date).toEqual(expected);
    });

    it("should error if date is not padded", function () {
      expect(() => parseDate("128-02-03")).toThrow();
      expect(() => parseDate("2020-2-03")).toThrow();
      expect(() => parseDate("2020-02-3")).toThrow();
    });

    it("should error if not all components are provided", function () {
      expect(() => parseDate("2020")).toThrow();
      expect(() => parseDate("2020-02")).toThrow();
    });

    it("should error if components are out of range", function () {
      expect(() => parseDate("2020-00-03")).toThrow();
      expect(() => parseDate("2020-13-03")).toThrow();
      expect(() => parseDate("2020-01-32")).toThrow();
      expect(() => parseDate("2020-02-30")).toThrow();
    });
  });

  describe("CalendarDate#toString", function () {
    it("should stringify a date", function () {
      const date = createCalendarDate({ year: 2020, month: 11, day: 20 });
      expect(temporalToString(date)).toBe("2020-11-20");
    });

    it("should stringify a date with padding", function () {
      const date = createCalendarDate({ year: 123, month: 2, day: 3 });
      expect(temporalToString(date)).toBe("0123-02-03");
    });
  });

  describe("parseDateTime", function () {
    it("should parse a date without a time", function () {
      const date = parseDateTime("2020-02-03");
      const expected = createCalendarDateTime({ year: 2020, month: 2, day: 3 });
      expect(date).toEqual(expected);
    });

    it("should parse a date with a time", function () {
      const date = parseDateTime("2020-02-03T12:23:24.12");
      const expected = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 12,
        minute: 23,
        second: 24,
        millisecond: 120,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with only hours", function () {
      const date = parseDateTime("2020-02-03T12");
      const expected = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with only hours and minutes", function () {
      const date = parseDateTime("2020-02-03T12:24");
      const expected = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 12,
        minute: 24,
        second: 0,
        millisecond: 0,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with only hours, minutes, and seconds", function () {
      const date = parseDateTime("2020-02-03T12:24:45");
      const expected = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 12,
        minute: 24,
        second: 45,
        millisecond: 0,
      });
      expect(date).toEqual(expected);
    });

    it("should error if date is not padded", function () {
      expect(() => parseDateTime("123-02-03T12:24:45")).toThrow();
      expect(() => parseDateTime("2020-2-03T12:24:45")).toThrow();
      expect(() => parseDateTime("2020-02-3T12:24:45")).toThrow();
    });

    it("should error if time is not padded", function () {
      expect(() => parseDateTime("2020-02-03T1:24:45")).toThrow();
      expect(() => parseDateTime("2020-02-03T01:4:45")).toThrow();
      expect(() => parseDateTime("2020-02-03T01:04:5")).toThrow();
    });

    it("should error if components are out of range", function () {
      expect(() => parseDateTime("2020-00-03")).toThrow();
      expect(() => parseDateTime("2020-13-03")).toThrow();
      expect(() => parseDateTime("2020-01-32")).toThrow();
      expect(() => parseDateTime("2020-02-30")).toThrow();
      expect(() => parseDateTime("2020-02-03T33:00")).toThrow();
      expect(() => parseDateTime("2020-02-03T23:99")).toThrow();
      expect(() => parseDateTime("2020-02-03T12:22:99")).toThrow();
    });
  });

  describe("CalendarDateTime#toString", function () {
    it("should stringify a date with a zero time", function () {
      const date = createCalendarDateTime({ year: 2020, month: 2, day: 3 });
      expect(temporalToString(date)).toBe("2020-02-03T00:00:00");
    });

    it("should stringify a date with a time", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 12,
        minute: 23,
        second: 45,
      });
      expect(temporalToString(date)).toBe("2020-02-03T12:23:45");
    });

    it("should stringify a date with a time and milliseconds", function () {
      const date = createCalendarDateTime({
        year: 2020,
        month: 2,
        day: 3,
        hour: 12,
        minute: 23,
        second: 45,
        millisecond: 120,
      });
      expect(temporalToString(date)).toBe("2020-02-03T12:23:45.12");
    });
  });

  describe("parseZonedDateTime", function () {
    it("should parse a date without a time or offset", function () {
      const date = parseZonedDateTime("2020-02-03[America/Los_Angeles]");
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with a time but no offset", function () {
      const date = parseZonedDateTime(
        "2020-02-03T12:24:45[America/Los_Angeles]"
      );
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with a time with milliseconds but no offset", function () {
      const date = parseZonedDateTime(
        "2020-02-03T12:24:45.12[America/Los_Angeles]"
      );
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
        millisecond: 120,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with a time and an offset with only hours", function () {
      const date = parseZonedDateTime(
        "2020-02-03T12:24:45-08[America/Los_Angeles]"
      );
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with a time and an offset with hours and minutes", function () {
      let date = parseZonedDateTime(
        "2020-02-03T12:24:45-08:00[America/Los_Angeles]"
      );
      let expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
      });
      expect(date).toEqual(expected);

      date = parseZonedDateTime(
        "2020-02-03T12:24:45-0800[America/Los_Angeles]"
      );
      expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
      });
      expect(date).toEqual(expected);

      date = parseZonedDateTime("2020-02-03T12:24:45-08[America/Los_Angeles]");
      expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
      });
      expect(date).toEqual(expected);

      date = parseZonedDateTime("2020-02-03T12:24:45+0000[UTC]");
      expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "UTC",
        offset: 0,
        hour: 12,
        minute: 24,
        second: 45,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with a time with milliseconds and an offset", function () {
      const date = parseZonedDateTime(
        "2020-02-03T12:24:45.12-08:00[America/Los_Angeles]"
      );
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
        millisecond: 120,
      });

      expect(date).toEqual(expected);
    });

    it("should disambiguate ambiguous times without an offset", function () {
      let date = parseZonedDateTime("2020-11-01T01:00[America/Los_Angeles]");
      let expected = createZonedDateTime({
        year: 2020,
        month: 11,
        day: 1,
        timezone: "America/Los_Angeles",
        offset: -25200000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);

      date = parseZonedDateTime("2021-03-14T02:00[America/Los_Angeles]");
      expected = createZonedDateTime({
        year: 2021,
        month: 3,
        day: 14,
        timezone: "America/Los_Angeles",
        offset: -25200000,
        hour: 3,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);
    });

    it("should accept a disambiguation option", function () {
      let date = parseZonedDateTime(
        "2020-11-01T01:00[America/Los_Angeles]",
        "later"
      );
      let expected = createZonedDateTime({
        year: 2020,
        month: 11,
        day: 1,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);

      date = parseZonedDateTime(
        "2021-03-14T02:00[America/Los_Angeles]",
        "earlier"
      );
      expected = createZonedDateTime({
        year: 2021,
        month: 3,
        day: 14,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);
    });

    it("should disambiguate ambiguous times with an offset", function () {
      let date = parseZonedDateTime(
        "2020-11-01T01:00-08:00[America/Los_Angeles]"
      );
      let expected = createZonedDateTime({
        year: 2020,
        month: 11,
        day: 1,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);

      date = parseZonedDateTime("2020-11-01T01:00-07:00[America/Los_Angeles]");
      expected = createZonedDateTime({
        year: 2020,
        month: 11,
        day: 1,
        timezone: "America/Los_Angeles",
        offset: -25200000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);
    });

    it("should error if parsing a date with an invalid offset", function () {
      expect(() =>
        parseZonedDateTime("2020-02-03T12:24:45.12-04:00[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2020-02-03T12:24:45.12-08:24[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2021-03-14T02:00-08:00[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2021-03-14T02:00-07:00[America/Los_Angeles]")
      ).toThrow();
    });

    it("should error if components are out of range", function () {
      expect(() =>
        parseZonedDateTime("2020-00-03[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2020-13-03[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2020-01-32[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2020-02-30[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2020-02-03T33:00[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2020-02-03T23:99[America/Los_Angeles]")
      ).toThrow();
      expect(() =>
        parseZonedDateTime("2020-02-03T12:22:99[America/Los_Angeles]")
      ).toThrow();
    });
  });

  describe("ZonedDateTime#toString", function () {
    it("should stringify a date", function () {
      const date = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
      });
      expect(temporalToString(date)).toBe(
        "2020-02-03T12:24:45-08:00[America/Los_Angeles]"
      );
    });

    it("should stringify a date with milliseconds", function () {
      const date = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 12,
        minute: 24,
        second: 45,
        millisecond: 120,
      });

      expect(temporalToString(date)).toBe(
        "2020-02-03T12:24:45.12-08:00[America/Los_Angeles]"
      );
    });
  });

  describe("parseAbsolute", function () {
    it("should parse a date without a time", function () {
      const date = parseAbsolute("2020-02-03Z", "America/Los_Angeles");
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 2,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 16,
      });

      expect(date).toEqual(expected);
    });

    it("should parse a date with an offset but no time", function () {
      const date = parseAbsolute("2020-02-03-08:00", "America/Los_Angeles");
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with a time", function () {
      const date = parseAbsolute("2020-02-03T22:32:45Z", "America/Los_Angeles");
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 14,
        minute: 32,
        second: 45,
      });
      expect(date).toEqual(expected);
    });

    it("should parse a date with a time and offset", function () {
      const date = parseAbsolute(
        "2020-02-03T22:32:45-08:00",
        "America/Los_Angeles"
      );
      const expected = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 22,
        minute: 32,
        second: 45,
      });
      expect(date).toEqual(expected);
    });

    it("should handle daylight saving time", function () {
      let date = parseAbsolute("2021-03-14T02:00-08:00", "America/Los_Angeles");
      let expected = createZonedDateTime({
        year: 2021,
        month: 3,
        day: 14,
        timezone: "America/Los_Angeles",
        offset: -25200000,
        hour: 3,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);

      date = parseAbsolute("2021-11-07T01:00-07:00", "America/Los_Angeles");
      expected = createZonedDateTime({
        year: 2021,
        month: 11,
        day: 7,
        timezone: "America/Los_Angeles",
        offset: -25200000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);

      date = parseAbsolute("2021-11-07T01:00-08:00", "America/Los_Angeles");
      expected = createZonedDateTime({
        year: 2021,
        month: 11,
        day: 7,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);

      date = parseAbsolute("2021-11-07T01:00-0800", "America/Los_Angeles");
      expected = createZonedDateTime({
        year: 2021,
        month: 11,
        day: 7,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);

      date = parseAbsolute("2021-11-07T01:00-08", "America/Los_Angeles");
      expected = createZonedDateTime({
        year: 2021,
        month: 11,
        day: 7,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);

      date = parseAbsolute("2021-11-07T01:00+0000", "America/Los_Angeles");
      expected = createZonedDateTime({
        year: 2021,
        month: 11,
        day: 6,
        timezone: "America/Los_Angeles",
        offset: -25200000,
        hour: 18,
        minute: 0,
        second: 0,
      });
      expect(date).toEqual(expected);
    });

    it("should error if missing offset or Z", function () {
      expect(() =>
        parseAbsolute("2020-02-03", "America/Los_Angeles")
      ).toThrow();
    });

    it("should error if components are out of range", function () {
      expect(() =>
        parseAbsolute("2020-00-03Z", "America/Los_Angeles")
      ).toThrow();
      expect(() =>
        parseAbsolute("2020-13-03Z", "America/Los_Angeles")
      ).toThrow();
      expect(() =>
        parseAbsolute("2020-01-32Z", "America/Los_Angeles")
      ).toThrow();
      expect(() =>
        parseAbsolute("2020-02-30Z", "America/Los_Angeles")
      ).toThrow();
      expect(() =>
        parseAbsolute("2020-02-03T33:00Z", "America/Los_Angeles")
      ).toThrow();
      expect(() =>
        parseAbsolute("2020-02-03T23:99Z", "America/Los_Angeles")
      ).toThrow();
      expect(() =>
        parseAbsolute("2020-02-03T12:22:99Z", "America/Los_Angeles")
      ).toThrow();
    });
  });

  describe("ZonedDateTime#toAbsoluteString", function () {
    it("should stringify a date", function () {
      const date = createZonedDateTime({
        year: 2020,
        month: 2,
        day: 3,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 14,
        minute: 32,
        second: 45,
      });
      expect(toAbsoluteString(date)).toBe("2020-02-03T22:32:45.000Z");
    });
  });

  describe("parseDuration", function () {
    it("parses an ISO 8601 duration string that contains years, months, weeks, days, hours, minutes, and seconds and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P3Y6M6W4DT12H30M5S");
      expect(duration).toStrictEqual({
        years: 3,
        months: 6,
        weeks: 6,
        days: 4,
        hours: 12,
        minutes: 30,
        seconds: 5,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, weeks, days, hours, minutes, and fractional values for seconds expressed with a period and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P3Y6M6W4DT12H30M5.5S");
      expect(duration).toStrictEqual({
        years: 3,
        months: 6,
        weeks: 6,
        days: 4,
        hours: 12,
        minutes: 30,
        seconds: 5.5,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, weeks, days, hours, minutes, and fractional values for seconds expressed with a comma and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P3Y6M6W4DT12H30M5,5S");
      expect(duration).toStrictEqual({
        years: 3,
        months: 6,
        weeks: 6,
        days: 4,
        hours: 12,
        minutes: 30,
        seconds: 5.5,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, weeks, days, hours, and fractional values for minutes expressed with a period and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P3Y6M6W4DT12H30.5M");
      expect(duration).toStrictEqual({
        years: 3,
        months: 6,
        weeks: 6,
        days: 4,
        hours: 12,
        minutes: 30.5,
        seconds: 0,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, weeks, days, hours, and fractional values for minutes expressed with a comma and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P3Y6M6W4DT12H30,5M");
      expect(duration).toStrictEqual({
        years: 3,
        months: 6,
        weeks: 6,
        days: 4,
        hours: 12,
        minutes: 30.5,
        seconds: 0,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, weeks, days, and fractional values for hours expressed with a period and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P3Y6M6W4DT12.5H");
      expect(duration).toStrictEqual({
        years: 3,
        months: 6,
        weeks: 6,
        days: 4,
        hours: 12.5,
        minutes: 0,
        seconds: 0,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, weeks, days, and fractional values for hours expressed with a comma and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P3Y6M6W4DT12.5H");
      expect(duration).toStrictEqual({
        years: 3,
        months: 6,
        weeks: 6,
        days: 4,
        hours: 12.5,
        minutes: 0,
        seconds: 0,
      });
    });

    it("parses a negative ISO 8601 duration string that contains years, months, weeks, days, hours, minutes, and seconds and returns a DateTimeDuration object", function () {
      const duration = parseDuration("-P3Y6M6W4DT12H30M5S");
      expect(duration).toStrictEqual({
        years: -3,
        months: -6,
        weeks: -6,
        days: -4,
        hours: -12,
        minutes: -30,
        seconds: -5,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, weeks, days, hours, minutes, and seconds with a preceding + sign and returns a DateTimeDuration object", function () {
      const duration = parseDuration("+P3Y6M6W4DT12H30M5S");
      expect(duration).toStrictEqual({
        years: 3,
        months: 6,
        weeks: 6,
        days: 4,
        hours: 12,
        minutes: 30,
        seconds: 5,
      });
    });

    it("parses an ISO 8601 duration string that contains hours, minutes, and seconds and returns a DateTimeDuration object", function () {
      const duration = parseDuration("PT20H35M15S");
      expect(duration).toStrictEqual({
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 20,
        minutes: 35,
        seconds: 15,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, weeks, and days and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P7Y8M14W6D");
      expect(duration).toStrictEqual({
        years: 7,
        months: 8,
        weeks: 14,
        days: 6,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it("parses an ISO 8601 duration string that contains years, months, hours, and seconds and returns a DateTimeDuration object", function () {
      const duration = parseDuration("P18Y7MT20H15S");
      expect(duration).toStrictEqual({
        years: 18,
        months: 7,
        weeks: 0,
        days: 0,
        hours: 20,
        minutes: 0,
        seconds: 15,
      });
    });

    it("throws an error when passed an improperly formatted ISO 8601 duration string", function () {
      expect(() => {
        parseDuration("+-P18Y7MT20H15S");
      }).toThrow("Invalid ISO 8601 Duration string: +-P18Y7MT20H15S");
      expect(() => {
        parseDuration("-+P18Y7MT20H15S");
      }).toThrow("Invalid ISO 8601 Duration string: -+P18Y7MT20H15S");
      expect(() => {
        parseDuration("--P18Y7MT20H15S");
      }).toThrow("Invalid ISO 8601 Duration string: --P18Y7MT20H15S");
      expect(() => {
        parseDuration("++P18Y7MT20H15S");
      }).toThrow("Invalid ISO 8601 Duration string: ++P18Y7MT20H15S");
      expect(() => {
        parseDuration("P18Y7MT");
      }).toThrow("Invalid ISO 8601 Duration string: P18Y7MT");
      expect(() => {
        parseDuration("P18Y7MT30H15S");
      }).toThrow("Invalid ISO 8601 Duration string: P18Y7MT30H15S");
      expect(() => {
        parseDuration("7Y6D85");
      }).toThrow("Invalid ISO 8601 Duration string: 7Y6D85");
      expect(() => {
        parseDuration("P1Y1M1W1DT1H1M1.123456789123S");
      }).toThrow(
        "Invalid ISO 8601 Duration string: P1Y1M1W1DT1H1M1.123456789123S"
      );
      expect(() => {
        parseDuration("P0.5Y");
      }).toThrow("Invalid ISO 8601 Duration string: P0.5Y");
      expect(() => {
        parseDuration("P1Y0,5M");
      }).toThrow("Invalid ISO 8601 Duration string: P1Y0,5M");
      expect(() => {
        parseDuration("P1Y1M0.5W");
      }).toThrow("Invalid ISO 8601 Duration string: P1Y1M0.5W");
      expect(() => {
        parseDuration("P1Y1M1W0,5D");
      }).toThrow("Invalid ISO 8601 Duration string: P1Y1M1W0,5D");
      expect(() => {
        parseDuration("P1Y1M1W1DT0.5H5S");
      }).toThrow(
        "Invalid ISO 8601 Duration string: P1Y1M1W1DT0.5H5S - only the smallest unit can be fractional"
      );
      expect(() => {
        parseDuration("P1Y1M1W1DT1.5H0,5M");
      }).toThrow(
        "Invalid ISO 8601 Duration string: P1Y1M1W1DT1.5H0,5M - only the smallest unit can be fractional"
      );
      expect(() => {
        parseDuration("P1Y1M1W1DT1H0.5M0.5S");
      }).toThrow(
        "Invalid ISO 8601 Duration string: P1Y1M1W1DT1H0.5M0.5S - only the smallest unit can be fractional"
      );
      expect(() => {
        parseDuration("P");
      }).toThrow("Invalid ISO 8601 Duration string: P");
      expect(() => {
        parseDuration("PT");
      }).toThrow("Invalid ISO 8601 Duration string: PT");
      expect(() => {
        parseDuration("-P");
      }).toThrow("Invalid ISO 8601 Duration string: -P");
      expect(() => {
        parseDuration("-PT");
      }).toThrow("Invalid ISO 8601 Duration string: -PT");
      expect(() => {
        parseDuration("+P");
      }).toThrow("Invalid ISO 8601 Duration string: +P");
      expect(() => {
        parseDuration("+PT");
      }).toThrow("Invalid ISO 8601 Duration string: +PT");
      expect(() => {
        parseDuration("P1Y1M1W1DT1H1M1.01Sjunk");
      }).toThrow("Invalid ISO 8601 Duration string: P1Y1M1W1DT1H1M1.01Sjunk");
      expect(() => {
        parseDuration("P-1Y1M");
      }).toThrow("Invalid ISO 8601 Duration string: P-1Y1M");
      expect(() => {
        parseDuration("P1Y-1M");
      }).toThrow("Invalid ISO 8601 Duration string: P1Y-1M");
    });
  });
});
