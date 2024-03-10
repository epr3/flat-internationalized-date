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

// Portions of the code in this file are based on code from the TC39 Temporal proposal.
// Original licensing can be found in the NOTICE file in the root directory of this source tree.

import { AnyCalendarDate, Calendar } from "../types";
import { CalendarDate, createCalendarDate } from "../CalendarDate";
import { GregorianCalendar } from "./GregorianCalendar";
import { copy } from "../utils";

const ERA_START_DATES = [
  [1868, 9, 8],
  [1912, 7, 30],
  [1926, 12, 25],
  [1989, 1, 8],
  [2019, 5, 1],
];
const ERA_END_DATES = [
  [1912, 7, 29],
  [1926, 12, 24],
  [1989, 1, 7],
  [2019, 4, 30],
];
const ERA_ADDENDS = [1867, 1911, 1925, 1988, 2018];
const ERA_NAMES = ["meiji", "taisho", "showa", "heisei", "reiwa"];

function findEraFromGregorianDate(date: AnyCalendarDate) {
  const idx = ERA_START_DATES.findIndex(([year, month, day]) => {
    if (date.year < year) {
      return true;
    }

    if (date.year === year && date.month < month) {
      return true;
    }

    if (date.year === year && date.month === month && date.day < day) {
      return true;
    }

    return false;
  });

  if (idx === -1) {
    return ERA_START_DATES.length - 1;
  }

  if (idx === 0) {
    return 0;
  }

  return idx - 1;
}

function toGregorian(date: AnyCalendarDate) {
  const eraAddend = ERA_ADDENDS[ERA_NAMES.indexOf(date.era!)];
  if (!eraAddend) {
    throw new Error("Unknown era: " + date.era);
  }

  return createCalendarDate({
    year: date.year + eraAddend,
    month: date.month,
    day: date.day,
  });
}

function getMinimums(date: AnyCalendarDate) {
  if (date.year === 1) {
    const idx = ERA_NAMES.indexOf(date.era!);
    return ERA_START_DATES[idx];
  }
}

function constrainDate(date: AnyCalendarDate) {
  let newDate = Object.assign({}, copy(date));
  const idx = ERA_NAMES.indexOf(date.era!);
  const end = ERA_END_DATES[idx];
  if (end !== null) {
    const [endYear, endMonth, endDay] = end;

    // Constrain the year to the maximum possible value in the era.
    // Then constrain the month and day fields within that.
    const maxYear = endYear - ERA_ADDENDS[idx];
    newDate = Object.assign({}, newDate, {
      year: Math.max(1, Math.min(maxYear, newDate.year)),
    });
    if (date.year === maxYear) {
      newDate = Object.assign({}, newDate, {
        month: Math.max(1, Math.min(endMonth, newDate.month)),
      });

      if (date.month === endMonth) {
        newDate = Object.assign({}, newDate, {
          day: Math.max(1, Math.min(endDay, newDate.day)),
        });
      }
    }
  }

  if (date.year === 1 && idx >= 0) {
    const [, startMonth, startDay] = ERA_START_DATES[idx];
    newDate = Object.assign({}, newDate, {
      month: Math.max(startMonth, newDate.month),
    });

    if (date.month === startMonth) {
      newDate = Object.assign({}, newDate, {
        day: Math.max(startDay, newDate.day),
      });
    }
  }

  return newDate;
}

/**
 * The Japanese calendar is based on the Gregorian calendar, but with eras for the reign of each Japanese emperor.
 * Whenever a new emperor ascends to the throne, a new era begins and the year starts again from 1.
 * Note that eras before 1868 (Gregorian) are not currently supported by this implementation.
 */
export const JapaneseCalendar: Calendar = {
  ...GregorianCalendar,
  name: "japanese",

  fromJulianDay(jd: number): CalendarDate {
    const date = super.fromJulianDay(jd);
    const era = findEraFromGregorianDate(date);

    return createCalendarDate({
      calendar: "japanese",
      era: ERA_NAMES[era],
      year: date.year - ERA_ADDENDS[era],
      month: date.month,
      day: date.day,
    });
  },

  toJulianDay(date: AnyCalendarDate) {
    return GregorianCalendar.toJulianDay(toGregorian(date));
  },

  balanceDate(date: AnyCalendarDate) {
    let newDate = Object.assign({}, copy(date));
    const gregorianDate = toGregorian(date);
    const era = findEraFromGregorianDate(gregorianDate);

    if (ERA_NAMES[era] !== date.era) {
      newDate = Object.assign({}, newDate, {
        era: ERA_NAMES[era],
        year: gregorianDate.year - ERA_ADDENDS[era],
      });
    }

    // Constrain in case we went before the first supported era.
    return constrainDate(newDate);
  },

  constrainDate,

  getEras() {
    return ERA_NAMES;
  },

  getYearsInEra(date: AnyCalendarDate): number {
    // Get the number of years in the era, taking into account the date's month and day fields.
    const era = ERA_NAMES.indexOf(date.era!);
    const cur = ERA_START_DATES[era];
    const next = ERA_START_DATES[era + 1];
    if (next == null) {
      // 9999 gregorian is the maximum year allowed.
      return 9999 - cur[0] + 1;
    }

    let years = next[0] - cur[0];

    if (
      date.month < next[1] ||
      (date.month === next[1] && date.day < next[2])
    ) {
      years++;
    }

    return years;
  },

  getDaysInMonth(date: AnyCalendarDate): number {
    return super.getDaysInMonth(toGregorian(date));
  },

  getMinimumMonthInYear(date: AnyCalendarDate): number {
    const start = getMinimums(date);
    return start ? start[1] : 1;
  },

  getMinimumDayInMonth(date: AnyCalendarDate): number {
    const start = getMinimums(date);
    return start && date.month === start[1] ? start[2] : 1;
  },
} satisfies Calendar;
