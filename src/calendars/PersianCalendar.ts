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

// Portions of the code in this file are based on code from ICU.
// Original licensing can be found in the NOTICE file in the root directory of this source tree.

import { AnyCalendarDate, Calendar } from "../types";
import { CalendarDate, createCalendarDate } from "../CalendarDate";
import { mod } from "../utils";
import { CALENDAR } from "./enum";

function julianDayRounder(jd: number) {
  return Math.floor(jd) + (jd - Math.floor(jd) >= 0.5 ? 0.5 : -0.5);
}

const PERSIAN_EPOCH = 1948320.5; // 622/03/19 Julian C.E.

function isLeapYear(year: number): boolean {
  return (
    ((((year - (year > 0 ? 474 : 473)) % 2820) + 474 + 38) * 682) % 2816 < 682
  );
}

function persianToJulianDay(year: number, month: number, day: number): number {
  const epochBase = year >= 0 ? year - 474 : year - 473;
  const epochYear = mod(epochBase, 2820) + 474;

  const offset = month <= 7 ? 31 * (month - 1) : 30 * (month - 1) + 6;

  const julianDay =
    day +
    offset +
    Math.floor((682 * epochYear - 110) / 2816) +
    (epochYear - 1) * 365 +
    Math.floor(epochBase / 2820) * 1029983 +
    PERSIAN_EPOCH -
    1;

  return Math.floor(julianDay) + Math.round(julianDay - Math.floor(julianDay));
}

/**
 * The Persian calendar is the main calendar used in Iran and Afghanistan. It has 12 months
 * in each year, the first 6 of which have 31 days, and the next 5 have 30 days. The 12th month
 * has either 29 or 30 days depending on whether it is a leap year. The Persian year starts
 * around the March equinox.
 */
export const PersianCalendar = {
  name: CALENDAR.PERSIAN,

  fromJulianDay(jd: number): CalendarDate {
    const julianDay = Math.floor(julianDayRounder(jd + 0.5)) + 0.5;
    const depoch = julianDay - julianDayRounder(persianToJulianDay(475, 1, 1));
    const cycle = Math.floor(depoch / 1029983);
    const cyear = mod(depoch, 1029983);
    let ycycle, aux1, aux2;

    if (cyear === 1029982) {
      ycycle = 2820;
    } else {
      aux1 = Math.floor(cyear / 366);
      aux2 = mod(cyear, 366);
      ycycle =
        Math.floor((2134 * aux1 + 2816 * aux2 + 2815) / 1028522) + aux1 + 1;
    }

    let year = ycycle + 2820 * cycle + 474;
    if (year <= 0) {
      year--;
    }

    const yday =
      julianDay - julianDayRounder(persianToJulianDay(year, 1, 1)) + 1;
    const month =
      yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    const day =
      julianDay - julianDayRounder(persianToJulianDay(year, month, 1));

    return createCalendarDate({
      calendar: CALENDAR.PERSIAN,
      year,
      month,
      day,
    });
  },

  toJulianDay(date: AnyCalendarDate): number {
    return persianToJulianDay(date.year, date.month, date.day);
  },

  getMonthsInYear(): number {
    return 12;
  },

  getDaysInMonth(date: AnyCalendarDate): number {
    const gregorianDaysInMonth = [
      31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29,
    ];

    if (date.month < 1 || date.month > 12) {
      throw new Error("Month is out of range");
    }

    if (date.year && isLeapYear(date.year) && date.month === 12) {
      return 30;
    }

    return gregorianDaysInMonth[date.month - 1];
  },

  getEras() {
    return ["AP"];
  },

  getYearsInEra(): number {
    // 9378-10-10 persian is 9999-12-31 gregorian.
    // Round down to 9377 to set the maximum full year.
    return 9377;
  },
} satisfies Calendar;
