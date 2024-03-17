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

import { AnyCalendarDate, AnyTime } from "./types";
import {
  CalendarDate,
  CalendarDateTime,
  Time,
  ZonedDateTime,
} from "./CalendarDate";
import {
  fromAbsolute,
  toAbsolute,
  toCalendar,
  toCalendarDate,
  toDate,
} from "./conversion";
import { weekStartData } from "./weekStartData";
import { add, subtract } from "./manipulation";
import { CALENDAR, calendars } from "./calendars";

export type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime;

/** Returns whether the given dates occur on the same day, regardless of the time or calendar system. */
export function isSameDay(a: DateValue, b: DateValue): boolean {
  b = toCalendar(b, a.calendar);
  return (
    a.era === b.era &&
    a.year === b.year &&
    a.month === b.month &&
    a.day === b.day
  );
}

/** Returns whether the given dates occur in the same month, using the calendar system of the first date. */
export function isSameMonth(a: DateValue, b: DateValue): boolean {
  b = toCalendar(b, a.calendar);
  // In the Japanese calendar, months can span multiple eras/years, so only compare the first of the month.
  a = startOfMonth(a);
  b = startOfMonth(b);
  return a.era === b.era && a.year === b.year && a.month === b.month;
}

/** Returns whether the given dates occur in the same year, using the calendar system of the first date. */
export function isSameYear(a: DateValue, b: DateValue): boolean {
  b = toCalendar(b, a.calendar);
  a = startOfYear(a);
  b = startOfYear(b);
  return a.era === b.era && a.year === b.year;
}

/** Returns whether the given dates occur on the same day, and are of the same calendar system. */
export function isEqualDay(a: DateValue, b: DateValue): boolean {
  return (
    a.calendar === b.calendar &&
    a.era === b.era &&
    a.year === b.year &&
    a.month === b.month &&
    a.day === b.day
  );
}

/** Returns whether the given dates occur in the same month, and are of the same calendar system. */
export function isEqualMonth(a: DateValue, b: DateValue): boolean {
  a = startOfMonth(a);
  b = startOfMonth(b);
  return (
    a.calendar === b.calendar &&
    a.era === b.era &&
    a.year === b.year &&
    a.month === b.month
  );
}

/** Returns whether the given dates occur in the same year, and are of the same calendar system. */
export function isEqualYear(a: DateValue, b: DateValue): boolean {
  a = startOfYear(a);
  b = startOfYear(b);
  return a.calendar === b.calendar && a.era === b.era && a.year === b.year;
}

/** Returns whether the date is today in the given time zone. */
export function isToday(date: DateValue, timeZone: string): boolean {
  return isSameDay(date, today(timeZone));
}

/**
 * Returns the day of week for the given date and locale. Days are numbered from zero to six,
 * where zero is the first day of the week in the given locale. For example, in the United States,
 * the first day of the week is Sunday, but in France it is Monday.
 */
export function getDayOfWeek(date: DateValue, locale: string): number {
  const julian = calendars[date.calendar].toJulianDay(date);

  // If julian is negative, then julian % 7 will be negative, so we adjust
  // accordingly.  Julian day 0 is Monday.
  let dayOfWeek = Math.ceil(julian + 1 - getWeekStart(locale)) % 7;
  if (dayOfWeek < 0) {
    dayOfWeek += 7;
  }

  return dayOfWeek;
}

/** Returns the current time in the given time zone. */
export function now(timeZone: string): ZonedDateTime {
  return fromAbsolute(Date.now(), timeZone);
}

/** Returns today's date in the given time zone. */
export function today(timeZone: string, calendar?: CALENDAR): CalendarDate {
  if (calendar) {
    return toCalendar(toCalendarDate(now(timeZone)), calendar);
  }

  return toCalendarDate(now(timeZone));
}

export function compareDate(a: DateValue, b: DateValue): number {
  return (
    calendars[a.calendar].toJulianDay(a) - calendars[b.calendar].toJulianDay(b)
  );
}

export function compareTime(a: AnyTime, b: AnyTime): number {
  return timeToMs(a) - timeToMs(b);
}

function timeToMs(a: AnyTime): number {
  return (
    a.hour * 60 * 60 * 1000 +
    a.minute * 60 * 1000 +
    a.second * 1000 +
    a.millisecond
  );
}

/**
 * Returns the number of hours in the given date and time zone.
 * Usually this is 24, but it could be 23 or 25 if the date is on a daylight saving transition.
 */
export function getHoursInDay(a: CalendarDate, timeZone: string): number {
  const ms = toAbsolute(a, timeZone);
  const tomorrow = add(a, { days: 1 });
  const tomorrowMs = toAbsolute(tomorrow, timeZone);
  return (tomorrowMs - ms) / 3600000;
}

let localTimeZone: string | null = null;

/** Returns the time zone identifier for the current user. */
export function getLocalTimeZone(): string {
  // TODO: invalidate this somehow?
  if (localTimeZone == null) {
    localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  return localTimeZone!;
}

/** Returns the first date of the month for the given date. */
export function startOfMonth(date: ZonedDateTime): ZonedDateTime;
export function startOfMonth(date: CalendarDateTime): CalendarDateTime;
export function startOfMonth(date: CalendarDate): CalendarDate;
export function startOfMonth(date: DateValue): DateValue;
export function startOfMonth(date: DateValue): DateValue {
  // Use `subtract` instead of `set` so we don't get constrained in an era.
  return subtract(date, { days: date.day - 1 });
}

/** Returns the last date of the month for the given date. */
export function endOfMonth(date: ZonedDateTime): ZonedDateTime;
export function endOfMonth(date: CalendarDateTime): CalendarDateTime;
export function endOfMonth(date: CalendarDate): CalendarDate;
export function endOfMonth(date: DateValue): DateValue;
export function endOfMonth(date: DateValue): DateValue {
  return add(date, {
    days: calendars[date.calendar].getDaysInMonth(date) - date.day,
  });
}

/** Returns the first day of the year for the given date. */
export function startOfYear(date: ZonedDateTime): ZonedDateTime;
export function startOfYear(date: CalendarDateTime): CalendarDateTime;
export function startOfYear(date: CalendarDate): CalendarDate;
export function startOfYear(date: DateValue): DateValue;
export function startOfYear(date: DateValue): DateValue {
  return startOfMonth(subtract(date, { months: date.month - 1 }));
}

/** Returns the last day of the year for the given date. */
export function endOfYear(date: ZonedDateTime): ZonedDateTime;
export function endOfYear(date: CalendarDateTime): CalendarDateTime;
export function endOfYear(date: CalendarDate): CalendarDate;
export function endOfYear(date: DateValue): DateValue;
export function endOfYear(date: DateValue): DateValue {
  return endOfMonth(
    add(date, {
      months: calendars[date.calendar].getMonthsInYear(date) - date.month,
    })
  );
}

export function getMinimumMonthInYear(date: AnyCalendarDate) {
  if (calendars[date.calendar].getMinimumMonthInYear) {
    return calendars[date.calendar].getMinimumMonthInYear!(date);
  }

  return 1;
}

export function getMinimumDayInMonth(date: AnyCalendarDate) {
  if (calendars[date.calendar].getMinimumDayInMonth) {
    return calendars[date.calendar].getMinimumDayInMonth!(date);
  }

  return 1;
}

/** Returns the first date of the week for the given date and locale. */
export function startOfWeek(date: ZonedDateTime, locale: string): ZonedDateTime;
export function startOfWeek(
  date: CalendarDateTime,
  locale: string
): CalendarDateTime;
export function startOfWeek(date: CalendarDate, locale: string): CalendarDate;
export function startOfWeek(date: DateValue, locale: string): DateValue;
export function startOfWeek(date: DateValue, locale: string): DateValue {
  const dayOfWeek = getDayOfWeek(date, locale);
  return subtract(date, { days: dayOfWeek });
}

/** Returns the last date of the week for the given date and locale. */
export function endOfWeek(date: ZonedDateTime, locale: string): ZonedDateTime;
export function endOfWeek(
  date: CalendarDateTime,
  locale: string
): CalendarDateTime;
export function endOfWeek(date: CalendarDate, locale: string): CalendarDate;
export function endOfWeek(date: DateValue, locale: string): DateValue {
  return add(startOfWeek(date, locale), { days: 6 });
}

const cachedRegions = new Map<string, string>();

function getRegion(locale: string): string | undefined {
  // If the Intl.Locale API is available, use it to get the region for the locale.
  if (Intl.Locale) {
    // Constructing an Intl.Locale is expensive, so cache the result.
    let region = cachedRegions.get(locale);
    if (!region) {
      region = new Intl.Locale(locale).maximize().region;
      if (region) {
        cachedRegions.set(locale, region);
      }
    }
    return region;
  }

  // If not, just try splitting the string.
  // If the second part of the locale string is 'u',
  // then this is a unicode extension, so ignore it.
  // Otherwise, it should be the region.
  const part = locale.split("-")[1];
  return part === "u" ? undefined : part;
}

function getWeekStart(locale: string): number {
  // TODO: use Intl.Locale for this once browsers support the weekInfo property
  // https://github.com/tc39/proposal-intl-locale-info
  const region = getRegion(locale);
  return region ? weekStartData[region as keyof typeof weekStartData] || 0 : 0;
}

/** Returns the number of weeks in the given month and locale. */
export function getWeeksInMonth(date: DateValue, locale: string): number {
  const days = calendars[date.calendar].getDaysInMonth(date);
  return Math.ceil((getDayOfWeek(startOfMonth(date), locale) + days) / 7);
}

export function compare(a: DateValue | Time, b: DateValue | Time): number {
  if (isZonedDateTime(a)) {
    if (isZonedDateTime(b))
      return toDate(a, a.timezone).getTime() - toDate(b, b.timezone).getTime();
    else if (isCalendarDateTime(b))
      return toDate(a, a.timezone).getTime() - toDate(b, a.timezone).getTime();
    else throw new Error("Cannot compare a ZonedDateTime with a Time value");
  }

  let res = 0;
  if (isCalendarDate(a) && isCalendarDate(b)) {
    res = compareDate(a, b);
  }
  if (
    (isCalendarDateTime(a) && isCalendarDateTime(b) && res === 0) ||
    (isTime(a) && isTime(b))
  ) {
    return compareTime(a, b);
  }

  return res;
}

/** Returns the lesser of the two provider dates. */
export function minDate<A extends DateValue, B extends DateValue>(
  a: A,
  b: B
): A | B {
  if (a && b) {
    return compare(a, b) <= 0 ? a : b;
  }

  return a || b;
}

/** Returns the greater of the two provider dates. */
export function maxDate<A extends DateValue, B extends DateValue>(
  a: A,
  b: B
): A | B {
  if (a && b) {
    return compare(a, b) >= 0 ? a : b;
  }

  return a || b;
}

const WEEKEND_DATA = {
  AF: [4, 5],
  AE: [5, 6],
  BH: [5, 6],
  DZ: [5, 6],
  EG: [5, 6],
  IL: [5, 6],
  IQ: [5, 6],
  IR: [5, 5],
  JO: [5, 6],
  KW: [5, 6],
  LY: [5, 6],
  OM: [5, 6],
  QA: [5, 6],
  SA: [5, 6],
  SD: [5, 6],
  SY: [5, 6],
  YE: [5, 6],
};

/** Returns whether the given date is on a weekend in the given locale. */
export function isWeekend(date: DateValue, locale: string): boolean {
  const julian = calendars[date.calendar].toJulianDay(date);

  // If julian is negative, then julian % 7 will be negative, so we adjust
  // accordingly.  Julian day 0 is Monday.
  let dayOfWeek = Math.ceil(julian + 1) % 7;
  if (dayOfWeek < 0) {
    dayOfWeek += 7;
  }

  const region = getRegion(locale);
  // Use Intl.Locale for this once weekInfo is supported.
  // https://github.com/tc39/proposal-intl-locale-info
  const [start, end] = WEEKEND_DATA[region! as keyof typeof WEEKEND_DATA] || [
    6, 0,
  ];
  return dayOfWeek === start || dayOfWeek === end;
}

/** Returns whether the given date is on a weekday in the given locale. */
export function isWeekday(date: DateValue, locale: string): boolean {
  return !isWeekend(date, locale);
}

export function isCalendarDate(date: object): date is CalendarDate {
  return "year" in date && "month" in date && "day" in date;
}

export function isCalendarDateTime(date: object): date is CalendarDateTime {
  return (
    isCalendarDate(date) &&
    "hour" in date &&
    "minute" in date &&
    "second" in date &&
    "millisecond" in date
  );
}

export function isZonedDateTime(date: object): date is ZonedDateTime {
  return isCalendarDateTime(date) && "timezone" in date;
}

export function isTime(date: object): date is Time {
  return (
    "hour" in date &&
    "minute" in date &&
    "second" in date &&
    !isCalendarDate(date)
  );
}
