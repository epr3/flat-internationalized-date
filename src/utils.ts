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
  CalendarDate,
  CalendarDateTime,
  createCalendarDate,
  createCalendarDateTime,
} from "./CalendarDate";

export function mod(amount: number, numerator: number): number {
  return amount - numerator * Math.floor(amount / numerator);
}

export function copy(date: CalendarDate): CalendarDate {
  if (date.era) {
    return createCalendarDate({
      calendar: date.calendar,
      era: date.era,
      year: date.year,
      month: date.month,
      day: date.day,
    });
  } else {
    return createCalendarDate({
      calendar: date.calendar,
      year: date.year,
      month: date.month,
      day: date.day,
    });
  }
}

export function copyDateTime(date: CalendarDateTime): CalendarDateTime {
  if (date.era) {
    return createCalendarDateTime({
      calendar: date.calendar,
      era: date.era,
      year: date.year,
      month: date.month,
      day: date.day,
      hour: date.hour,
      minute: date.minute,
      second: date.second,
      millisecond: date.millisecond,
    });
  } else {
    return createCalendarDateTime({
      calendar: date.calendar,
      year: date.year,
      month: date.month,
      day: date.day,
      hour: date.hour,
      minute: date.minute,
      second: date.second,
    });
  }
}
