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
  AnyCalendarDate,
  AnyDateTime,
  AnyTime,
  CycleOptions,
  CycleTimeOptions,
  DateDuration,
  DateField,
  DateFields,
  DateTimeDuration,
  Disambiguation,
  TimeDuration,
  TimeField,
  TimeFields,
} from "./types";
import {
  CalendarDate,
  CalendarDateTime,
  Time,
  ZonedDateTime,
} from "./CalendarDate";
import {
  epochFromDate,
  fromAbsolute,
  toAbsolute,
  toCalendar,
  toCalendarDateTime,
} from "./conversion";
import { GregorianCalendar } from "./calendars/GregorianCalendar";
import { calendars } from "./calendars";
import { compare } from "./queries";

const ONE_HOUR = 3600000;

export function copy(date: CalendarDateTime): CalendarDateTime;
export function copy(date: CalendarDate): CalendarDate;
export function copy(
  date: AnyCalendarDate | AnyDateTime
): AnyCalendarDate | AnyDateTime {
  return Object.assign({}, date);
}

export function add(
  date: CalendarDateTime,
  duration: DateTimeDuration
): CalendarDateTime;
export function add(date: CalendarDate, duration: DateDuration): CalendarDate;
export function add(
  date: CalendarDate | CalendarDateTime,
  duration: DateTimeDuration
): CalendarDate | CalendarDateTime;
export function add(
  date: CalendarDate | CalendarDateTime,
  duration: DateTimeDuration
) {
  let mutableDate: AnyCalendarDate | AnyDateTime = Object.assign({}, date);
  const days =
    "hour" in mutableDate ? addTimeFields(mutableDate, duration).days : 0;

  mutableDate = addYears(mutableDate, duration.years || 0);
  if (calendars[mutableDate.calendar].balanceYearMonth) {
    mutableDate = calendars[mutableDate.calendar].balanceYearMonth!(
      mutableDate,
      date
    );
  }

  mutableDate = Object.assign({}, mutableDate, {
    month: mutableDate.month + (duration.months || 0),
  });

  mutableDate = balanceDay(
    Object.assign({}, constrainMonthDay(balanceYearMonth(mutableDate)), {
      day:
        mutableDate.day +
        (duration.weeks || 0) * 7 +
        (duration.days || 0) +
        days,
    })
  );

  if (calendars[mutableDate.calendar].balanceDate) {
    mutableDate = calendars[mutableDate.calendar].balanceDate!(mutableDate);
  }

  // Constrain in case adding ended up with a date outside the valid range for the calendar system.
  // The behavior here is slightly different than when constraining in the `set` function in that
  // we adjust smaller fields to their minimum/maximum values rather than constraining each field
  // individually. This matches the general behavior of `add` vs `set` regarding how fields are balanced.
  if (mutableDate.year < 1) {
    mutableDate = Object.assign({}, mutableDate, {
      year: 1,
      month: 1,
      day: 1,
    });
  }

  const maxYear = calendars[mutableDate.calendar].getYearsInEra(mutableDate);
  if (mutableDate.year > maxYear) {
    const isInverseEra =
      calendars[mutableDate.calendar].isInverseEra?.(mutableDate);
    mutableDate = Object.assign({}, mutableDate, {
      year: maxYear,
      month: isInverseEra
        ? calendars[mutableDate.calendar].getMonthsInYear(mutableDate)
        : 1,
      day: isInverseEra
        ? calendars[mutableDate.calendar].getDaysInMonth(mutableDate)
        : 1,
    });
  }

  if (mutableDate.month < 1) {
    mutableDate = Object.assign({}, mutableDate, {
      month: 1,
      day: 1,
    });
  }

  const maxMonth = calendars[mutableDate.calendar].getMonthsInYear(mutableDate);
  if (mutableDate.month > maxMonth) {
    mutableDate = Object.assign({}, mutableDate, {
      month: maxMonth,
      day: calendars[mutableDate.calendar].getDaysInMonth(mutableDate),
    });
  }

  return Object.assign({}, mutableDate, {
    day: Math.max(
      1,
      Math.min(
        calendars[mutableDate.calendar].getDaysInMonth(mutableDate),
        mutableDate.day
      )
    ),
  });
}

function addYears(date: AnyCalendarDate, years: number): AnyCalendarDate {
  let yearsCopy = years;
  if (calendars[date.calendar].isInverseEra?.(date)) {
    yearsCopy = -years;
  }
  return Object.assign({}, date, { year: date.year + yearsCopy });
}

function balanceYearMonth(date: AnyCalendarDate): AnyCalendarDate {
  let mutableDate = Object.assign({}, date);
  while (date.month < 1) {
    mutableDate = addYears(date, -1);
    const month =
      mutableDate.month +
      calendars[mutableDate.calendar].getMonthsInYear(mutableDate);
    mutableDate = Object.assign({}, mutableDate, {
      month,
    });
  }

  let monthsInYear = 0;
  while (
    date.month > (monthsInYear = calendars[date.calendar].getMonthsInYear(date))
  ) {
    const month = mutableDate.month - monthsInYear;
    mutableDate = Object.assign({}, mutableDate, {
      month,
    });
    mutableDate = addYears(date, 1);
  }
  return mutableDate;
}

function balanceDay(date: AnyCalendarDate): AnyCalendarDate {
  let newDate = Object.assign({}, date);
  while (date.day < 1) {
    newDate = Object.assign({}, newDate, {
      month: newDate.month - 1,
    });

    newDate = balanceYearMonth(date);
    newDate = Object.assign({}, newDate, {
      day: newDate.day + calendars[newDate.calendar].getDaysInMonth(newDate),
    });
  }

  while (date.day > calendars[date.calendar].getDaysInMonth(date)) {
    newDate = Object.assign({}, newDate, {
      day: date.day - calendars[date.calendar].getDaysInMonth(date),
    });
    newDate = Object.assign({}, newDate, {
      month: date.month + 1,
    });

    newDate = balanceYearMonth(date);
  }

  return newDate;
}

function constrainMonthDay(date: AnyCalendarDate): AnyCalendarDate {
  return Object.assign({}, date, {
    month: Math.max(
      1,
      Math.min(calendars[date.calendar].getMonthsInYear(date), date.month)
    ),
    day: Math.max(
      1,
      Math.min(calendars[date.calendar].getDaysInMonth(date), date.day)
    ),
  });
}

export function constrain(date: AnyCalendarDate): AnyCalendarDate {
  let newDate = Object.assign({}, date);
  if (calendars[date.calendar].constrainDate) {
    newDate = Object.assign(
      {},
      calendars[date.calendar].constrainDate!(newDate)
    );
  }

  newDate = Object.assign({}, newDate, {
    year: Math.max(
      1,
      Math.min(calendars[newDate.calendar].getYearsInEra(newDate), newDate.year)
    ),
  });

  return constrainMonthDay(newDate);
}

export function invertDuration(duration: DateTimeDuration): DateTimeDuration {
  const inverseDuration: DateTimeDuration = {};
  for (const key in duration) {
    if (typeof duration[key as keyof DateTimeDuration] === "number") {
      inverseDuration[key as keyof DateTimeDuration] =
        -duration[key as keyof DateTimeDuration]!;
    }
  }

  return inverseDuration;
}

export function subtract(
  date: CalendarDateTime,
  duration: DateTimeDuration
): CalendarDateTime;
export function subtract(
  date: CalendarDate,
  duration: DateDuration
): CalendarDate;
export function subtract(
  date: CalendarDate | CalendarDateTime,
  duration: DateTimeDuration
): CalendarDate | CalendarDateTime {
  return add(date, invertDuration(duration));
}

export function set(
  date: CalendarDateTime,
  fields: DateFields
): CalendarDateTime;
export function set(date: CalendarDate, fields: DateFields): CalendarDate;
export function set(date: CalendarDate | CalendarDateTime, fields: DateFields) {
  const mutableDate: AnyCalendarDate = Object.assign({}, date, {
    year: fields.year ?? date.year,
    month: fields.month ?? date.month,
    day: fields.day ?? date.day,
    era: fields.era ?? date.era,
  });

  return constrain(mutableDate);
}

export function setTime(
  value: CalendarDateTime,
  fields: TimeFields
): CalendarDateTime;
export function setTime(value: Time, fields: TimeFields): Time;
export function setTime(value: Time | CalendarDateTime, fields: TimeFields) {
  const mutableValue = Object.assign({}, value, {
    hour: fields.hour ?? value.hour,
    minute: fields.minute ?? value.minute,
    second: fields.second ?? value.second,
    millisecond: fields.millisecond ?? value.millisecond,
  });

  return constrainTime(mutableValue);
}

function balanceTime(time: AnyTime): { days: number; time: Time } {
  let newTime = Object.assign({}, time);

  newTime = Object.assign({}, newTime, {
    second: newTime.hour + Math.floor(newTime.millisecond / 1000),
    millisecond: nonNegativeMod(newTime.millisecond, 1000),
  });

  newTime = Object.assign({}, newTime, {
    minute: newTime.minute + Math.floor(newTime.second / 60),
    second: nonNegativeMod(newTime.second, 60),
  });

  newTime = Object.assign({}, newTime, {
    hour: newTime.hour + Math.floor(newTime.minute / 60),
    minute: nonNegativeMod(newTime.minute, 60),
  });

  newTime = Object.assign({}, newTime, {
    hour: nonNegativeMod(newTime.hour, 24),
  });
  const days = Math.floor(time.hour / 24);

  return {
    days,
    time: Object.assign({}, time, newTime, { type: "Time" }) as Time,
  };
}

export function constrainTime(time: AnyTime): AnyTime {
  return Object.assign({}, time, {
    hour: Math.max(0, Math.min(time.hour, 23)),
    minute: Math.max(0, Math.min(time.minute, 59)),
    second: Math.max(0, Math.min(time.second, 59)),
    millisecond: Math.max(0, Math.min(time.millisecond, 1000)),
  });
}

function nonNegativeMod(a: number, b: number) {
  let result = a % b;
  if (result < 0) {
    result += b;
  }
  return result;
}

function addTimeFields(
  time: AnyTime,
  duration: TimeDuration
): { time: Time; days: number } {
  const newTime = Object.assign({}, time, {
    hours: duration.hours || 0,
    minutes: duration.minutes || 0,
    seconds: duration.seconds || 0,
    milliseconds: duration.milliseconds || 0,
  });
  return balanceTime(newTime);
}

export function addTime(time: Time, duration: TimeDuration): Time {
  const res = Object.assign({}, time);
  return addTimeFields(res, duration).time;
}

export function subtractTime(time: Time, duration: TimeDuration): Time {
  return addTime(time, invertDuration(duration));
}

export function cycleDate(
  value: CalendarDateTime,
  field: DateField,
  amount: number,
  options?: CycleOptions
): CalendarDateTime;
export function cycleDate(
  value: CalendarDate,
  field: DateField,
  amount: number,
  options?: CycleOptions
): CalendarDate;
export function cycleDate(
  value: CalendarDate | CalendarDateTime,
  field: DateField,
  amount: number,
  options?: CycleOptions
) {
  let mutable: CalendarDate | CalendarDateTime = Object.assign({}, value);

  switch (field) {
    case "era": {
      const eras = calendars[value.calendar].getEras();
      let eraIndex = eras.indexOf(value.era!);
      if (eraIndex < 0) {
        throw new Error("Invalid era: " + value.era);
      }
      eraIndex = cycleValue(
        eraIndex,
        amount,
        0,
        eras.length - 1,
        options?.round
      );
      mutable = Object.assign({}, mutable, { era: eras[eraIndex] });

      // Constrain the year and other fields within the era, so the era doesn't change when we balance below.
      mutable = constrain(mutable) as CalendarDate | CalendarDateTime;
      break;
    }
    case "year": {
      if (calendars[mutable.calendar].isInverseEra?.(mutable)) {
        amount = -amount;
      }

      // The year field should not cycle within the era as that can cause weird behavior affecting other fields.
      // We need to also allow values < 1 so that decrementing goes to the previous era. If we get -Infinity back
      // we know we wrapped around after reaching 9999 (the maximum), so set the year back to 1.
      mutable = Object.assign({}, mutable, {
        year: cycleValue(value.year, amount, -Infinity, 9999, options?.round),
      });

      if (mutable.year === -Infinity) {
        mutable = Object.assign({}, mutable, { year: 1 });
      }

      if (calendars[mutable.calendar].balanceYearMonth) {
        mutable = calendars[mutable.calendar].balanceYearMonth!(
          mutable,
          value
        ) as CalendarDate | CalendarDateTime;
      }
      break;
    }
    case "month":
      mutable = Object.assign({}, mutable, {
        month: cycleValue(
          value.month,
          amount,
          1,
          calendars[value.calendar].getMonthsInYear(value),
          options?.round
        ),
      });
      break;
    case "day":
      mutable = Object.assign({}, mutable, {
        day: cycleValue(
          value.day,
          amount,
          1,
          calendars[value.calendar].getDaysInMonth(value),
          options?.round
        ),
      });

      break;
    default:
      throw new Error("Unsupported field " + field);
  }

  if (calendars[value.calendar].balanceDate) {
    mutable = calendars[value.calendar].balanceDate!(mutable) as
      | CalendarDate
      | CalendarDateTime;
  }

  return constrain(mutable);
}

function cycleValue(
  value: number,
  amount: number,
  min: number,
  max: number,
  round = false
) {
  if (round) {
    value += Math.sign(amount);

    if (value < min) {
      value = max;
    }

    const div = Math.abs(amount);
    if (amount > 0) {
      value = Math.ceil(value / div) * div;
    } else {
      value = Math.floor(value / div) * div;
    }

    if (value > max) {
      value = min;
    }
  } else {
    value += amount;
    if (value < min) {
      value = max - (min - value - 1);
    } else if (value > max) {
      value = min + (value - max - 1);
    }
  }

  return value;
}

export function cycleTime(
  value: CalendarDateTime,
  field: TimeField,
  amount: number,
  options?: CycleTimeOptions
): CalendarDateTime;
export function cycleTime(
  value: ZonedDateTime,
  field: TimeField,
  amount: number,
  options?: CycleTimeOptions
): ZonedDateTime;
export function cycleTime(
  value: Time,
  field: TimeField,
  amount: number,
  options?: CycleTimeOptions
): Time;
export function cycleTime(
  value: Time | CalendarDateTime | ZonedDateTime,
  field: TimeField,
  amount: number,
  options?: CycleTimeOptions
): Time | CalendarDateTime | ZonedDateTime {
  let mutable = Object.assign({}, value);

  switch (field) {
    case "hour": {
      const hours = value.hour;
      let min = 0;
      let max = 23;
      if (options?.hourCycle === 12) {
        const isPM = hours >= 12;
        min = isPM ? 12 : 0;
        max = isPM ? 23 : 11;
      }
      mutable = Object.assign({}, mutable, {
        hour: cycleValue(hours, amount, min, max, options?.round),
      });
      break;
    }
    case "minute":
      mutable = Object.assign({}, mutable, {
        minute: cycleValue(value.minute, amount, 0, 59, options?.round),
      });
      break;
    case "second":
      mutable = Object.assign({}, mutable, {
        second: cycleValue(value.second, amount, 0, 59, options?.round),
      });

      break;
    case "millisecond":
      mutable = Object.assign({}, mutable, {
        millisecond: cycleValue(
          value.millisecond,
          amount,
          0,
          999,
          options?.round
        ),
      });
      break;
    default:
      throw new Error("Unsupported field " + field);
  }

  return mutable;
}

export function addZoned(
  dateTime: ZonedDateTime,
  duration: DateTimeDuration
): ZonedDateTime {
  let ms: number;
  if (
    (duration.years != null && duration.years !== 0) ||
    (duration.months != null && duration.months !== 0) ||
    (duration.weeks != null && duration.weeks !== 0) ||
    (duration.days != null && duration.days !== 0)
  ) {
    const res = add(toCalendarDateTime(dateTime), {
      years: duration.years,
      months: duration.months,
      weeks: duration.weeks,
      days: duration.days,
    });

    // Changing the date may change the timezone offset, so we need to recompute
    // using the 'compatible' disambiguation.
    ms = toAbsolute(res, dateTime.timezone);
  } else {
    // Otherwise, preserve the offset of the original date.
    ms = epochFromDate(dateTime) - dateTime.offset;
  }

  // Perform time manipulation in milliseconds rather than on the original time fields to account for DST.
  // For example, adding one hour during a DST transition may result in the hour field staying the same or
  // skipping an hour. This results in the offset field changing value instead of the specified field.
  ms += duration.milliseconds || 0;
  ms += (duration.seconds || 0) * 1000;
  ms += (duration.minutes || 0) * 60 * 1000;
  ms += (duration.hours || 0) * 60 * 60 * 1000;

  const res = fromAbsolute(ms, dateTime.timezone);
  return toCalendar(res, dateTime.calendar);
}

export function subtractZoned(
  dateTime: ZonedDateTime,
  duration: DateTimeDuration
): ZonedDateTime {
  return addZoned(dateTime, invertDuration(duration));
}

export function cycleZoned(
  dateTime: ZonedDateTime,
  field: DateField | TimeField,
  amount: number,
  options?: CycleTimeOptions
): ZonedDateTime {
  // For date fields, we want the time to remain consistent and the UTC offset to potentially change to account for DST changes.
  // For time fields, we want the time to change by the amount given. This may result in the hour field staying the same, but the UTC
  // offset changing in the case of a backward DST transition, or skipping an hour in the case of a forward DST transition.
  switch (field) {
    case "hour": {
      let min = 0;
      let max = 23;
      if (options?.hourCycle === 12) {
        const isPM = dateTime.hour >= 12;
        min = isPM ? 12 : 0;
        max = isPM ? 23 : 11;
      }

      // The minimum and maximum hour may be affected by daylight saving time.
      // For example, it might jump forward at midnight, and skip 1am.
      // Or it might end at midnight and repeat the 11pm hour. To handle this, we get
      // the possible absolute times for the min and max, and find the maximum range
      // that is within the current day.
      const plainDateTime = toCalendarDateTime(dateTime);
      const minDate = toCalendar(
        setTime(plainDateTime, { hour: min }),
        GregorianCalendar.name
      );
      const minAbsolute = [
        toAbsolute(minDate, dateTime.timezone, "earlier"),
        toAbsolute(minDate, dateTime.timezone, "later"),
      ].filter(
        (ms) => fromAbsolute(ms, dateTime.timezone).day === minDate.day
      )[0];

      const maxDate = toCalendar(
        setTime(plainDateTime, { hour: max }),
        GregorianCalendar.name
      );
      const maxAbsolute = [
        toAbsolute(maxDate, dateTime.timezone, "earlier"),
        toAbsolute(maxDate, dateTime.timezone, "later"),
      ]
        .filter((ms) => fromAbsolute(ms, dateTime.timezone).day === maxDate.day)
        .pop()!;

      // Since hours may repeat, we need to operate on the absolute time in milliseconds.
      // This is done in hours from the Unix epoch so that cycleValue works correctly,
      // and then converted back to milliseconds.
      let ms = epochFromDate(dateTime) - dateTime.offset;
      const hours = Math.floor(ms / ONE_HOUR);
      const remainder = ms % ONE_HOUR;
      ms =
        cycleValue(
          hours,
          amount,
          Math.floor(minAbsolute / ONE_HOUR),
          Math.floor(maxAbsolute / ONE_HOUR),
          options?.round
        ) *
          ONE_HOUR +
        remainder;

      // Now compute the new timezone offset, and convert the absolute time back to local time.
      return toCalendar(fromAbsolute(ms, dateTime.timezone), dateTime.calendar);
    }
    case "minute":
    case "second":
    case "millisecond":
      return cycleTime(dateTime, field, amount, options) as ZonedDateTime;
    case "era":
    case "year":
    case "month":
    case "day": {
      const res = cycleDate(
        toCalendarDateTime(dateTime),
        field,
        amount,
        options
      );
      const ms = toAbsolute(res, dateTime.timezone);
      return toCalendar(fromAbsolute(ms, dateTime.timezone), dateTime.calendar);
    }
    default:
      throw new Error("Unsupported field " + field);
  }
}

export function setZoned(
  dateTime: ZonedDateTime,
  fields: DateFields & TimeFields,
  disambiguation?: Disambiguation
): ZonedDateTime {
  // Set the date/time fields, and recompute the UTC offset to account for DST changes.
  // We also need to validate by converting back to a local time in case hours are skipped during forward DST transitions.
  const plainDateTime = toCalendarDateTime(dateTime);
  const res = setTime(set(plainDateTime, fields), fields);

  // If the resulting plain date time values are equal, return the original time.
  // We don't want to change the offset when setting the time to the same value.
  if (compare(res, plainDateTime) === 0) {
    return dateTime;
  }

  const ms = toAbsolute(res, dateTime.timezone, disambiguation);
  return toCalendar(fromAbsolute(ms, dateTime.timezone), dateTime.calendar);
}
