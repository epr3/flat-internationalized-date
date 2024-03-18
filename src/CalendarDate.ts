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

import { CALENDAR, calendars, IslamicUmalquraCalendar } from "./calendars";
import { constrain, constrainTime } from "./manipulation";

export function createCalendarDate({
  calendar,
  era,
  year,
  month,
  day,
}: {
  calendar?: CALENDAR;
  era?: string;
  year: number;
  month: number;
  day: number;
}): CalendarDate {
  let calendarObj: CalendarDate = {
    calendar: calendar ?? CALENDAR.GREGORIAN,
    era,
    year,
    month,
    day,
  };

  if (calendar === CALENDAR.ISLAMIC_UMALQURA)
    IslamicUmalquraCalendar.constructCalendar();

  if (!calendarObj.era) {
    const eras = calendars[calendarObj.calendar].getEras();
    calendarObj = { ...calendarObj, era: eras[eras.length - 1] };
  }

  return { ...constrain(calendarObj) } as CalendarDate;
}

export function createCalendarDateTime({
  calendar,
  era,
  year,
  month,
  day,
  hour,
  minute,
  second,
  millisecond,
}: {
  calendar?: CALENDAR;
  era?: string;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}): CalendarDateTime {
  return {
    ...constrain({
      ...createCalendarDate({
        calendar,
        era,
        year,
        month,
        day,
      }),
      hour: hour ?? 0,
      minute: minute ?? 0,
      second: second ?? 0,
      millisecond: millisecond ?? 0,
    }),
  } as CalendarDateTime;
}

export function createZonedDateTime({
  calendar,
  era,
  year,
  month,
  day,
  hour,
  minute,
  second,
  millisecond,
  timezone,
  offset,
}: {
  calendar?: CALENDAR;
  era?: string;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  timezone: string;
  offset: number;
}): ZonedDateTime {
  return {
    ...constrain({
      ...createCalendarDateTime({
        calendar,
        era,
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
      }),
      timezone,
      offset,
    }),
  } as ZonedDateTime;
}

export const createTime = ({
  hour,
  minute,
  second,
  millisecond,
}: {
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}): Time => {
  return {
    ...constrainTime({
      hour: hour ?? 0,
      minute: minute ?? 0,
      second: second ?? 0,
      millisecond: millisecond ?? 0,
    }),
  } as Time;
};

/** A CalendarDate represents a date without any time components in a specific calendar system. */
export interface CalendarDate {
  // i.e. a ZonedDateTime should not be be passable to a parameter that expects CalendarDate.
  // If that behavior is desired, use the AnyCalendarDate interface instead.
  /** The calendar system associated with this date, e.g. Gregorian. */
  readonly calendar: CALENDAR;
  /** The calendar era for this date, e.g. "BC" or "AD". */
  readonly era?: string;
  /** The year of this date within the era. */
  readonly year: number;
  /**
   * The month number within the year. Note that some calendar systems such as Hebrew
   * may have a variable number of months per year. Therefore, month numbers may not
   * always correspond to the same month names in different years.
   */
  readonly month: number;
  /** The day number within the month. */
  readonly day: number;
}

/** A Time represents a clock time without any date components. */
export interface Time {
  // This prevents TypeScript from allowing other types with the same fields to match.
  /** The hour, numbered from 0 to 23. */
  readonly hour: number;
  /** The minute in the hour. */
  readonly minute: number;
  /** The second in the minute. */
  readonly second: number;
  /** The millisecond in the second. */
  readonly millisecond: number;
}

/** A CalendarDateTime represents a date and time without a time zone, in a specific calendar system. */
export interface CalendarDateTime extends CalendarDate {
  /** The hour in the day, numbered from 0 to 23. */
  readonly hour: number;
  /** The minute in the hour. */
  readonly minute: number;
  /** The second in the minute. */
  readonly second: number;
  /** The millisecond in the second. */
  readonly millisecond: number;
}

/** A ZonedDateTime represents a date and time in a specific time zone and calendar system. */
export interface ZonedDateTime extends CalendarDateTime {
  /** The IANA time zone identifier that this date and time is represented in. */
  readonly timezone: string;
  /** The UTC offset for this time, in milliseconds. */
  readonly offset: number;
}
