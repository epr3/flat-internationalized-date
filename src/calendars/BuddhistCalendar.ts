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
import {
  fromExtendedYear,
  GregorianCalendar,
  getExtendedYear,
} from "./GregorianCalendar";
import { CALENDAR } from "./enum";

const BUDDHIST_ERA_START = -543;

/**
 * The Buddhist calendar is the same as the Gregorian calendar, but counts years
 * starting from the birth of Buddha in 543 BC (Gregorian). It supports only one
 * era, identified as 'BE'.
 */

function toGregorian(date: AnyCalendarDate) {
  const [era, year] = fromExtendedYear(date.year + BUDDHIST_ERA_START);
  return createCalendarDate({
    era,
    year,
    month: date.month,
    day: date.day,
  });
}

function fromJulianDay(jd: number): CalendarDate {
  const gregorianDate = GregorianCalendar.fromJulianDay(jd);
  const year = getExtendedYear(gregorianDate.era!, gregorianDate.year);
  return createCalendarDate({
    calendar: CALENDAR.BUDDHIST,
    year: year - BUDDHIST_ERA_START,
    month: gregorianDate.month,
    day: gregorianDate.day,
  });
}

function toJulianDay(date: AnyCalendarDate) {
  return GregorianCalendar.toJulianDay(toGregorian(date));
}

function getEras() {
  return ["BE"];
}

function getDaysInMonth(date: AnyCalendarDate): number {
  return GregorianCalendar.getDaysInMonth(toGregorian(date));
}

export const BuddhistCalendar = {
  ...GregorianCalendar,
  name: CALENDAR.BUDDHIST,
  fromJulianDay,
  toJulianDay,
  getEras,
  getDaysInMonth,
  balanceDate(date: AnyCalendarDate) {
    return date;
  },
} satisfies Calendar;
