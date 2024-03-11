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

import { IslamicUmalquraCalendar } from ".";
import { constrain, constrainTime } from "./manipulation";

// function shiftArgs(args: any[]) {
//     const calendar: Calendar = typeof args[0] === "object"
//         ? args.shift()
//         : new GregorianCalendar();

//     let era: string;
//     if (typeof args[0] === "string") {
//         era = args.shift();
//     } else {
//         const eras = calendar.getEras();
//         era = eras[eras.length - 1];
//     }

//     const year = args.shift();
//     const month = args.shift();
//     const day = args.shift();

//     return [calendar, era, year, month, day];
// }

export function createCalendarDate({
  calendar,
  era,
  year,
  month,
  day,
}: {
  calendar?: string;
  era?: string;
  year: number;
  month: number;
  day: number;
}): CalendarDate {
  const calendarObj: CalendarDate = {
    calendar: calendar ?? "gregorian",
    era,
    year,
    month,
    day,
  };

  if (calendar === "islamic-umalqura")
    IslamicUmalquraCalendar.constructCalendar();

  return Object.assign({}, constrain(calendarObj)) as CalendarDate;
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
  calendar?: string;
  era?: string;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}): CalendarDateTime {
  return constrain(
    Object.assign(
      {},
      createCalendarDate({
        calendar,
        era,
        year,
        month,
        day,
      }),
      {
        hour: hour ?? 0,
        minute: minute ?? 0,
        second: second ?? 0,
        millisecond: millisecond ?? 0,
      }
    )
  ) as CalendarDateTime;
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
  calendar?: string;
  era?: string;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  timezone: string;
  offset?: number;
}): ZonedDateTime {
  return constrain(
    Object.assign(
      {},
      createCalendarDateTime({
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
      {
        timezone,
        offset: offset ?? 0,
      }
    )
  ) as ZonedDateTime;
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
  return constrainTime(
    Object.assign(
      {},
      {
        hour: hour ?? 0,
        minute: minute ?? 0,
        second: second ?? 0,
        millisecond: millisecond ?? 0,
      }
    )
  ) as Time;
};

/** A CalendarDate represents a date without any time components in a specific calendar system. */
export interface CalendarDate {
  // i.e. a ZonedDateTime should not be be passable to a parameter that expects CalendarDate.
  // If that behavior is desired, use the AnyCalendarDate interface instead.
  /** The calendar system associated with this date, e.g. Gregorian. */
  readonly calendar: string;
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

  //     constructor(year: number, month: number, day: number);
  //     constructor(era: string, year: number, month: number, day: number);
  //     constructor(calendar: Calendar, year: number, month: number, day: number);
  //     constructor(calendar: Calendar, era: string, year: number, month: number, day: number);
  //     constructor(...args: any[]) {
  //         const [calendar, era, year, month, day] = shiftArgs(args);
  //         this.calendar = calendar;
  //         this.era = era;
  //         this.year = year;
  //         this.month = month;
  //         this.day = day;

  //         constrain(this);
  //     }

  //     /** Returns a copy of this date. */
  //     copy(): CalendarDate {
  //         if (this.era) {
  //             return new CalendarDate(this.calendar, this.era, this.year, this.month, this.day);
  //         } else {
  //             return new CalendarDate(this.calendar, this.year, this.month, this.day);
  //         }
  //     }

  //     /** Returns a new `CalendarDate` with the given duration added to it. */
  //     add(duration: DateDuration): CalendarDate {
  //         return add(this, duration);
  //     }

  //     /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  //     subtract(duration: DateDuration): CalendarDate {
  //         return subtract(this, duration);
  //     }

  //     /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  //     set(fields: DateFields): CalendarDate {
  //         return set(this, fields);
  //     }

  //     /**
  //    * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  //    * When the resulting value reaches the limits of the field, it wraps around.
  //    */
  //     cycle(field: DateField, amount: number, options?: CycleOptions): CalendarDate {
  //         return cycleDate(this, field, amount, options);
  //     }

  //     /** Converts the date to a native JavaScript Date object, with the time set to midnight in the given time zone. */
  //     toDate(timeZone: string): Date {
  //         return toDate(this, timeZone);
  //     }

  //     /** Converts the date to an ISO 8601 formatted string. */
  //     toString(): string {
  //         return dateToString(this);
  //     }

  //     /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  //     compare(b: AnyCalendarDate): number {
  //         return compareDate(this, b);
  //     }
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

  //     constructor(
  //         hour: number = 0,
  //         minute: number = 0,
  //         second: number = 0,
  //         millisecond: number = 0
  //     ) {
  //         this.hour = hour;
  //         this.minute = minute;
  //         this.second = second;
  //         this.millisecond = millisecond;
  //         constrainTime(this);
  //     }

  //     /** Returns a copy of this time. */
  //     copy(): Time {
  //         return new Time(this.hour, this.minute, this.second, this.millisecond);
  //     }

  //     /** Returns a new `Time` with the given duration added to it. */
  //     add(duration: TimeDuration) {
  //         return addTime(this, duration);
  //     }

  //     /** Returns a new `Time` with the given duration subtracted from it. */
  //     subtract(duration: TimeDuration) {
  //         return subtractTime(this, duration);
  //     }

  //     /** Returns a new `Time` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  //     set(fields: TimeFields) {
  //         return setTime(this, fields);
  //     }

  //     /**
  //    * Returns a new `Time` with the given field adjusted by a specified amount.
  //    * When the resulting value reaches the limits of the field, it wraps around.
  //    */
  //     cycle(field: TimeField, amount: number, options?: CycleTimeOptions) {
  //         return cycleTime(this, field, amount, options);
  //     }

  //     /** Converts the time to an ISO 8601 formatted string. */
  //     toString() {
  //         return timeToString(this);
  //     }

  //     /** Compares this time with another. A negative result indicates that this time is before the given one, and a positive time indicates that it is after. */
  //     compare(b: AnyTime) {
  //         return compareTime(this, b);
  //     }
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

  //     constructor(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number);
  //     constructor(era: string, year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number);
  //     constructor(calendar: Calendar, year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number);
  //     constructor(calendar: Calendar, era: string, year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number);
  //     constructor(...args: any[]) {
  //         const [calendar, era, year, month, day] = shiftArgs(args);
  //         this.calendar = calendar;
  //         this.era = era;
  //         this.year = year;
  //         this.month = month;
  //         this.day = day;
  //         this.hour = args.shift() || 0;
  //         this.minute = args.shift() || 0;
  //         this.second = args.shift() || 0;
  //         this.millisecond = args.shift() || 0;

  //         constrain(this);
  //     }

  //     /** Returns a copy of this date. */
  //     copy(): CalendarDateTime {
  //         if (this.era) {
  //             return new CalendarDateTime(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  //         } else {
  //             return new CalendarDateTime(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  //         }
  //     }

  //     /** Returns a new `CalendarDateTime` with the given duration added to it. */
  //     add(duration: DateTimeDuration): CalendarDateTime {
  //         return add(this, duration);
  //     }

  //     /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  //     subtract(duration: DateTimeDuration): CalendarDateTime {
  //         return subtract(this, duration);
  //     }

  //     /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  //     set(fields: DateFields & TimeFields): CalendarDateTime {
  //         return set(setTime(this, fields), fields);
  //     }

  //     /**
  //    * Returns a new `CalendarDateTime` with the given field adjusted by a specified amount.
  //    * When the resulting value reaches the limits of the field, it wraps around.
  //    */
  //     cycle(field: DateField | TimeField, amount: number, options?: CycleTimeOptions): CalendarDateTime {
  //         switch (field) {
  //         case "era":
  //         case "year":
  //         case "month":
  //         case "day":
  //             return cycleDate(this, field, amount, options);
  //         default:
  //             return cycleTime(this, field, amount, options);
  //         }
  //     }

  //     /** Converts the date to a native JavaScript Date object in the given time zone. */
  //     toDate(timeZone: string, disambiguation?: Disambiguation): Date {
  //         return toDate(this, timeZone, disambiguation);
  //     }

  //     /** Converts the date to an ISO 8601 formatted string. */
  //     toString(): string {
  //         return dateTimeToString(this);
  //     }

  //     /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  //     compare(b: CalendarDate | CalendarDateTime | ZonedDateTime): number {
  //         const res = compareDate(this, b);
  //         if (res === 0) {
  //             return compareTime(this, toCalendarDateTime(b));
  //         }

  //         return res;
  //     }
}

/** A ZonedDateTime represents a date and time in a specific time zone and calendar system. */
export interface ZonedDateTime extends CalendarDateTime {
  /** The IANA time zone identifier that this date and time is represented in. */
  readonly timezone: string;
  /** The UTC offset for this time, in milliseconds. */
  readonly offset: number;

  //     constructor(year: number, month: number, day: number, timeZone: string, offset: number, hour?: number, minute?: number, second?: number, millisecond?: number);
  //     constructor(era: string, year: number, month: number, day: number, timeZone: string, offset: number, hour?: number, minute?: number, second?: number, millisecond?: number);
  //     constructor(calendar: Calendar, year: number, month: number, day: number, timeZone: string, offset: number, hour?: number, minute?: number, second?: number, millisecond?: number);
  //     constructor(calendar: Calendar, era: string, year: number, month: number, day: number, timeZone: string, offset: number, hour?: number, minute?: number, second?: number, millisecond?: number);
  //     constructor(...args: any[]) {
  //         const [calendar, era, year, month, day] = shiftArgs(args);
  //         const timeZone = args.shift();
  //         const offset = args.shift();
  //         this.calendar = calendar;
  //         this.era = era;
  //         this.year = year;
  //         this.month = month;
  //         this.day = day;
  //         this.timeZone = timeZone;
  //         this.offset = offset;
  //         this.hour = args.shift() || 0;
  //         this.minute = args.shift() || 0;
  //         this.second = args.shift() || 0;
  //         this.millisecond = args.shift() || 0;

  //         constrain(this);
  //     }

  //     /** Returns a copy of this date. */
  //     copy(): ZonedDateTime {
  //         if (this.era) {
  //             return new ZonedDateTime(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
  //         } else {
  //             return new ZonedDateTime(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
  //         }
  //     }

  //     /** Returns a new `ZonedDateTime` with the given duration added to it. */
  //     add(duration: DateTimeDuration) {
  //         return addZoned(this, duration);
  //     }

  //     /** Returns a new `ZonedDateTime` with the given duration subtracted from it. */
  //     subtract(duration: DateTimeDuration) {
  //         return subtractZoned(this, duration);
  //     }

  //     /** Returns a new `ZonedDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  //     set(fields: DateFields & TimeFields, disambiguation?: Disambiguation) {
  //         return setZoned(this, fields, disambiguation);
  //     }

  //     /**
  //    * Returns a new `ZonedDateTime` with the given field adjusted by a specified amount.
  //    * When the resulting value reaches the limits of the field, it wraps around.
  //    */
  //     cycle(field: DateField | TimeField, amount: number, options?: CycleTimeOptions) {
  //         return cycleZoned(this, field, amount, options);
  //     }

  //     /** Converts the date to a native JavaScript Date object. */
  //     toDate() {
  //         return zonedToDate(this);
  //     }

  //     /** Converts the date to an ISO 8601 formatted string, including the UTC offset and time zone identifier. */
  //     toString() {
  //         return zonedDateTimeToString(this);
  //     }

  //     /** Converts the date to an ISO 8601 formatted string in UTC. */
  //     toAbsoluteString() {
  //         return this.toDate().toISOString();
  //     }

  //     /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  //     compare(b: CalendarDate | CalendarDateTime | ZonedDateTime) {
  //     // TODO: Is this a bad idea??
  //         return this.toDate().getTime() - toZoned(b, this.timeZone).toDate().getTime();
  //     }
}
