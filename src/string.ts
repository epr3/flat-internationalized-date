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

import { AnyDateTime, DateTimeDuration, Disambiguation } from "./types";
import {
  CalendarDate,
  CalendarDateTime,
  Time,
  ZonedDateTime,
  createCalendarDate,
  createCalendarDateTime,
  createTime,
  createZonedDateTime,
} from "./CalendarDate";
import {
  epochFromDate,
  fromAbsolute,
  possibleAbsolutes,
  toAbsolute,
  toCalendar,
  toCalendarDateTime,
  toTimeZone,
  zonedToDate,
} from "./conversion";
import {
  getLocalTimeZone,
  isCalendarDateTime,
  isTime,
  isZonedDateTime,
} from "./queries";
import { GregorianCalendar } from "./calendars/GregorianCalendar";
import { calendars } from "./calendars";

const TIME_RE = /^(\d{2})(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME_RE =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/;
const ZONED_DATE_TIME_RE =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?)?\[(.*?)\]$/;
const ABSOLUTE_RE =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
const DATE_TIME_DURATION_RE =
  /^((?<negative>-)|\+)?P((?<years>\d*)Y)?((?<months>\d*)M)?((?<weeks>\d*)W)?((?<days>\d*)D)?((?<time>T)((?<hours>\d*[.,]?\d{1,9})H)?((?<minutes>\d*[.,]?\d{1,9})M)?((?<seconds>\d*[.,]?\d{1,9})S)?)?$/;
const requiredDurationTimeGroups = ["hours", "minutes", "seconds"];
const requiredDurationGroups = [
  "years",
  "months",
  "weeks",
  "days",
  ...requiredDurationTimeGroups,
];

/** Parses an ISO 8601 time string. */
export function parseTime(value: string): Time {
  const m = value.match(TIME_RE);
  if (!m) {
    throw new Error("Invalid ISO 8601 time string: " + value);
  }

  return createTime({
    hour: parseNumber(m[1], 0, 23),
    minute: m[2] ? parseNumber(m[2], 0, 59) : 0,
    second: m[3] ? parseNumber(m[3], 0, 59) : 0,
    millisecond: m[4] ? parseNumber(m[4], 0, Infinity) * 1000 : 0,
  });
}

/** Parses an ISO 8601 date string, with no time components. */
export function parseDate(value: string): CalendarDate {
  const m = value.match(DATE_RE);
  if (!m) {
    throw new Error("Invalid ISO 8601 date string: " + value);
  }

  const date: CalendarDate = createCalendarDate({
    year: parseNumber(m[1], 0, 9999),
    month: parseNumber(m[2], 1, 12),
    day: 1,
  });

  return Object.assign({}, date, {
    day: parseNumber(m[3], 1, calendars[date.calendar].getDaysInMonth(date)),
  }) as CalendarDate;
}

/** Parses an ISO 8601 date and time string, with no time zone. */
export function parseDateTime(value: string): CalendarDateTime {
  const m = value.match(DATE_TIME_RE);
  if (!m) {
    throw new Error("Invalid ISO 8601 date time string: " + value);
  }

  const date: CalendarDateTime = createCalendarDateTime({
    year: parseNumber(m[1], 1, 9999),
    month: parseNumber(m[2], 1, 12),
    day: 1,
    hour: m[4] ? parseNumber(m[4], 0, 23) : 0,
    minute: m[5] ? parseNumber(m[5], 0, 59) : 0,
    second: m[6] ? parseNumber(m[6], 0, 59) : 0,
    millisecond: m[7] ? parseNumber(m[7], 0, Infinity) * 1000 : 0,
  });

  return Object.assign({}, date, {
    day: parseNumber(m[3], 1, calendars[date.calendar].getDaysInMonth(date)),
  }) as CalendarDateTime;
}

/**
 * Parses an ISO 8601 date and time string with a time zone extension and optional UTC offset
 * (e.g. "2021-11-07T00:45[America/Los_Angeles]" or "2021-11-07T00:45-07:00[America/Los_Angeles]").
 * Ambiguous times due to daylight saving time transitions are resolved according to the `disambiguation`
 * parameter.
 */
export function parseZonedDateTime(
  value: string,
  disambiguation?: Disambiguation
): ZonedDateTime {
  const m = value.match(ZONED_DATE_TIME_RE);
  if (!m) {
    throw new Error("Invalid ISO 8601 date time string: " + value);
  }

  let newDate: ZonedDateTime = createZonedDateTime({
    year: parseNumber(m[1], 1, 9999),
    month: parseNumber(m[2], 1, 12),
    day: 1,
    timezone: m[10],
    offset: 0,
    hour: m[4] ? parseNumber(m[4], 0, 23) : 0,
    minute: m[5] ? parseNumber(m[5], 0, 59) : 0,
    second: m[6] ? parseNumber(m[6], 0, 59) : 0,
    millisecond: m[7] ? parseNumber(m[7], 0, Infinity) * 1000 : 0,
  });

  newDate = Object.assign({}, newDate, {
    day: parseNumber(
      m[3],
      1,
      calendars[newDate.calendar].getDaysInMonth(newDate)
    ),
  }) as ZonedDateTime;

  const plainDateTime = toCalendarDateTime(newDate as ZonedDateTime);

  let ms: number;
  if (m[8]) {
    newDate = Object.assign({}, newDate, {
      offset:
        parseNumber(m[8], -23, 23) * 60 * 60 * 1000 +
        parseNumber(m[9] ?? "0", 0, 59) * 60 * 1000,
    });
    ms = epochFromDate(newDate as ZonedDateTime) - newDate.offset;

    // Validate offset against parsed date.
    const absolutes = possibleAbsolutes(plainDateTime, newDate.timezone);
    if (!absolutes.includes(ms)) {
      throw new Error(
        `Offset ${offsetToString(newDate.offset)} is invalid for ${dateTimeToString(newDate)} in ${newDate.timezone}`
      );
    }
  } else {
    // Convert to absolute and back to fix invalid times due to DST.
    ms = toAbsolute(
      toCalendarDateTime(plainDateTime),
      newDate.timezone,
      disambiguation
    );
  }

  return fromAbsolute(ms, newDate.timezone);
}

/**
 * Parses an ISO 8601 date and time string with a UTC offset (e.g. "2021-11-07T07:45:00Z"
 * or "2021-11-07T07:45:00-07:00"). The result is converted to the provided time zone.
 */
export function parseAbsolute(value: string, timezone: string): ZonedDateTime {
  const m = value.match(ABSOLUTE_RE);
  if (!m) {
    throw new Error("Invalid ISO 8601 date time string: " + value);
  }

  let newDate: ZonedDateTime = createZonedDateTime({
    year: parseNumber(m[1], 1, 9999),
    month: parseNumber(m[2], 1, 12),
    day: 1,
    timezone,
    offset: 0,
    hour: m[4] ? parseNumber(m[4], 0, 23) : 0,
    minute: m[5] ? parseNumber(m[5], 0, 59) : 0,
    second: m[6] ? parseNumber(m[6], 0, 59) : 0,
    millisecond: m[7] ? parseNumber(m[7], 0, Infinity) * 1000 : 0,
  });

  const newTimezone = newDate.timezone;
  newDate = Object.assign({}, newDate, {
    day: parseNumber(
      m[3],
      1,
      calendars[newDate.calendar].getDaysInMonth(newDate)
    ),
  }) as ZonedDateTime;

  if (m[8]) {
    newDate = Object.assign({}, newDate, {
      offset:
        parseNumber(m[8], -23, 23) * 60 * 60 * 1000 +
        parseNumber(m[9] ?? "0", 0, 59) * 60 * 1000,
    });
  }

  return toTimeZone(newDate as ZonedDateTime, newTimezone);
}

/**
 * Parses an ISO 8601 date and time string with a UTC offset (e.g. "2021-11-07T07:45:00Z"
 * or "2021-11-07T07:45:00-07:00"). The result is converted to the user's local time zone.
 */
export function parseAbsoluteToLocal(value: string): ZonedDateTime {
  return parseAbsolute(value, getLocalTimeZone());
}

function parseNumber(value: string, min: number, max: number) {
  const val = Number(value);
  if (val < min || val > max) {
    throw new RangeError(`Value out of range: ${min} <= ${val} <= ${max}`);
  }

  return val;
}

export function timeToString(time: Time): string {
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}:${String(time.second).padStart(2, "0")}${time.millisecond ? String(time.millisecond / 1000).slice(1) : ""}`;
}

export function dateToString(date: CalendarDate): string {
  const gregorianDate = toCalendar(date, GregorianCalendar.name);
  return `${String(gregorianDate.year).padStart(4, "0")}-${String(gregorianDate.month).padStart(2, "0")}-${String(gregorianDate.day).padStart(2, "0")}`;
}

export function dateTimeToString(date: AnyDateTime): string {
  return `${dateToString(date)}T${timeToString(date)}`;
}

export function toAbsoluteString(date: ZonedDateTime): string {
  return zonedToDate(date).toISOString();
}

function offsetToString(offset: number) {
  const sign = Math.sign(offset) < 0 ? "-" : "+";
  offset = Math.abs(offset);
  const offsetHours = Math.floor(offset / (60 * 60 * 1000));
  const offsetMinutes = (offset % (60 * 60 * 1000)) / (60 * 1000);
  return `${sign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
}

export function zonedDateTimeToString(date: ZonedDateTime): string {
  return `${dateTimeToString(date)}${offsetToString(date.offset)}[${date.timezone}]`;
}

/**
 * Parses an ISO 8601 duration string (e.g. "P3Y6M6W4DT12H30M5S").
 * @param value An ISO 8601 duration string.
 * @returns A DateTimeDuration object.
 */
export function parseDuration(value: string): Required<DateTimeDuration> {
  const match = value.match(DATE_TIME_DURATION_RE);

  if (!match) {
    throw new Error(`Invalid ISO 8601 Duration string: ${value}`);
  }

  const parseDurationGroup = (
    group: string | undefined,
    isNegative: boolean,
    min: number,
    max: number
  ): number => {
    if (!group) {
      return 0;
    }
    try {
      const sign = isNegative ? -1 : 1;
      return sign * parseNumber(group.replace(",", "."), min, max);
    } catch {
      throw new Error(`Invalid ISO 8601 Duration string: ${value}`);
    }
  };

  const isNegative = !!match.groups?.negative;

  const hasRequiredGroups = requiredDurationGroups.some(
    (group) => match.groups?.[group]
  );

  if (!hasRequiredGroups) {
    throw new Error(`Invalid ISO 8601 Duration string: ${value}`);
  }

  const durationStringIncludesTime = match.groups?.time;

  if (durationStringIncludesTime) {
    const hasRequiredDurationTimeGroups = requiredDurationTimeGroups.some(
      (group) => match.groups?.[group]
    );
    if (!hasRequiredDurationTimeGroups) {
      throw new Error(`Invalid ISO 8601 Duration string: ${value}`);
    }
  }

  const duration: DateTimeDuration = {
    years: parseDurationGroup(match.groups?.years, isNegative, 0, 9999),
    months: parseDurationGroup(match.groups?.months, isNegative, 0, 12),
    weeks: parseDurationGroup(match.groups?.weeks, isNegative, 0, Infinity),
    days: parseDurationGroup(match.groups?.days, isNegative, 0, 31),
    hours: parseDurationGroup(match.groups?.hours, isNegative, 0, 23),
    minutes: parseDurationGroup(match.groups?.minutes, isNegative, 0, 59),
    seconds: parseDurationGroup(match.groups?.seconds, isNegative, 0, 59),
  };

  if (
    duration.hours !== undefined &&
    duration.hours % 1 !== 0 &&
    (duration.minutes || duration.seconds)
  ) {
    throw new Error(
      `Invalid ISO 8601 Duration string: ${value} - only the smallest unit can be fractional`
    );
  }

  if (
    duration.minutes !== undefined &&
    duration.minutes % 1 !== 0 &&
    duration.seconds
  ) {
    throw new Error(
      `Invalid ISO 8601 Duration string: ${value} - only the smallest unit can be fractional`
    );
  }

  return duration as Required<DateTimeDuration>;
}

export function temporalToString(
  date: Time | CalendarDate | CalendarDateTime | ZonedDateTime
): string {
  if (isTime(date)) {
    return timeToString(date);
  }

  if (isZonedDateTime(date)) {
    return zonedDateTimeToString(date);
  }

  if (isCalendarDateTime(date)) {
    return dateTimeToString(date);
  }

  return dateToString(date);
}
