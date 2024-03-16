# Flat Internationalized Date

This library is a fork of [@internationalized/date](https://github.com/adobe/react-spectrum/tree/main/packages/%40internationalized/date) by Adobe.

Most of the functionality has been ported over from `@internationalized/date`

Its purpose is to provide an interface for representing and manipulating dates and times in a locale-aware manner without using ES6 classes.

Main usage of this library would be with Vue or any other framework that requires the use of JS primitives.

## Install
``` npm install flat-internationalized-date ```

## Usage
```js
import { createCalendarDate, add, temporalToString } from "flat-internationalized-date"

const date = createCalendarDate({ year: 2024, month: 3, day: 15 })
const addedDate = add(date, { days: 1 })
console.log(temporalToString(addedDate))
```

More information about most of the package functionality can be checked [here](https://react-spectrum.adobe.com/internationalized/date/index.html).

## API
### Create dates/times

You can create dates or times using any of the utility functions: `createCalendarDate`, `createCalendarDateTime`, `createTime` and `createZonedDateTime`.

Examples
```js
import { createCalendarDate, createCalendarDateTime, createTime, createZonedDateTime } from "flat-internationalized-date"

const date = createCalendarDate({ year: 2024, month: 3, day: 15 }) // calendar defaults to "gregorian" and the era to "AD"
const dateTime = createCalendarDateTime({ year: 2024, month: 3, day: 15, hour: 0 }) // minutes, seconds and milliseconds default to 0
const time = createTime({ hour: 22 })
const zonedDateTime = createZonedDateTime({ year: 2024, month: 3, day: 15, hour: 0, minute: 2, second: 3, timezone: "America/Los_Angeles", offset: 0 })
```

### Available calendars

All available calendars can be accessed using the `CALENDAR` enum.

```js
export enum CALENDAR {
  GREGORIAN = "gregorian",
  BUDDHIST = "buddhist",
  HEBREW = "hebrew",
  INDIAN = "indian",
  COPTIC = "coptic",
  ETHIOPIC = "ethiopic",
  ETHIOPIC_AMETE_ALEM = "ethiopic-amete-alem",
  ISLAMIC_CIVIL = "islamic-civil",
  ISLAMIC_TABULAR = "islamic-tabular",
  ISLAMIC_UMALQURA = "islamic-umalqura",
  JAPANESE = "japanese",
  PERSIAN = "persian",
  TAIWAN = "roc", // Republic of China
}
```

### Manipulation
Every manipulation function returns a new object. The available manipulations functions are: `add`, `subtract`, `cycle` and `set.

```js
import { createCalendarDate, add, subtract, cycle, set } from "flat-internationalized-date";

const date = createCalendarDate({ year: 2024, month: 3, day: 15 })
const addedDate = add(date, { days: 5 }) // add 5 days, increments next temporal segment if it overflows
const subtractedDate = subtract(date, { months: 1 }) // subtract 1 day, decrements the previous temporal segment if it underflows
const cycledDate = cycle(date, "day", 1) // increments by 1 day, resetting to 0 when reaching 59
const setDate = set(date, { year: 2025 }) // sets the year to 2025
```
### Conversion

| Function               | Arguments                                      | Output Type        | Description                                                                                                                                                                                   |
|------------------------|------------------------------------------------|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **toCalendarDate**     | `AnyCalendarDate`                              | `CalendarDate`     | Converts object to `CalendarDate`                                                                                                                                                             |
| **toCalendarDateTime** | `AnyCalendarDate`, `AnyTime`?                  | `CalendarDateTime` | Converts object to `CalendarDateTime`                                                                                                                                                         |
| **toTime**             | `CalendarDateTime` or `ZonedDateTime`          | `Time`             | Extracts time from object                                                                                                                                                                     |
| **toCalendar**         | `AnyCalendarDate`, `CALENDAR`                  | `AnyCalendarDate`  | Converts calendar to another                                                                                                                                                                  |
| **toZoned**            | `AnyCalendarDate`, `string`, `Disambiguation`? | `ZonedDateTime`    | Converts a date value to a `ZonedDateTime` in the provided time zone. The `disambiguation` option can be set to control how values that fall on daylight saving time changes are interpreted. |
| **toTimeZone**         | `ZonedDateTime`, `string`                      | `ZonedDateTime`    | Converts a `ZonedDateTime` from one time zone to another.                                                                                                                                     |
| **toLocalTimeZone**    | `ZonedDateTime`                                | `ZonedDateTime`    | Converts the given `ZonedDateTime` into the user's local time zone.                                                                                                                           |
| **fromDate**           | `Date`, `string`                               | `ZonedDateTime`    | Takes a `Date` object and converts it to the provided time zone                                                                                                                               |
| **fromAbsolute**       | `number`, `string`                             | `ZonedDateTime`    | Takes a Unix epoch (milliseconds since 1970) and converts it to the provided time zone.                                                                                                       |
| **toDate**             | `AnyCalendarDate`, `string`, `Disambiguation`  | `Date`             | Converts a calendar date to the native `Date`                                                                                                                                                 |


### Queries

`AnyCalendarDate` objects can be compared either for full or partial equality, or in order to determine which date is before or after another.

The compare method can be used to determine if a date is before or after another. It returns a number less than zero if the first date is before the second, zero if the values are equal, or a number greater than zero if the first date is after the second.

```js
import { compare, createCalendarDate } from 'flat-internationalized-date'

const a = createCalendarDate({ year: 2022, month: 2, day: 3 });
const b = createCalendarDate({ year: 2022, month: 3, day: 4 });

compare(a, b) < 0; // true
compare(b, a) > 0; // true

```

In addition, the following functions can be used to perform a partial comparison. These functions accept dates in different calendar systems, and the second date is converted to the calendar system of the first date before comparison.

`isSameYear` – Returns whether the given dates occur in the same year, using the calendar system of the first date.
`isSameMonth` – Returns whether the given dates occur in the same month, using the calendar system of the first date.
`isSameDay` – Returns whether the given dates occur on the same day, regardless of the time or calendar system.
`isToday` – Returns whether the date is today in the given time zone.

```js
import { CALENDAR, isSameMonth, createCalendarDate } from 'flat-internationalized-date';

isSameMonth(createCalendarDate({year: 2021, month: 4, day: 16), createCalendarDate({ year: 2021, month: 4, day: 30 })); // true
isSameMonth(createCalendarDate({year: 2021, month: 4, day: 16 }), createCalendarDate({year: 2021, month: 8, day: 2 })); // false
isSameMonth(
  createCalendarDate({ year: 2021, month: 4, day: 16 }),
  createCalendarDate({ calendar: CALENDAR.ISLAMIC_UMALQURA, year: 1442, month: 9, day: 4 })
); // true

```
A similar set of functions is also available that does not convert between calendar systems and requires the calendars to be equal.

`isEqualYear` – Returns whether the given dates occur in the same year, and are of the same calendar system.
`isEqualMonth` – Returns whether the given dates occur in the same month, and are of the same calendar system.
`isEqualDay` – Returns whether the given dates occur on the same day, and are of the same calendar system.

```js
import { isEqualMonth, CALENDAR, createCalendarDate } from 'flat-internationalized-date';

isEqualMonth(createCalendarDate({year: 2021, month: 4, day: 16 }), createCalendarDate({year: 2021, month: 4, day: 30 })); // true
isEqualMonth(createCalendarDate({year: 2021, month: 4, day: 16 }), createCalendarDate({year: 2021, month: 8, day: 2 })); // false
isEqualMonth(
  createCalendarDate({year: 2021, month: 4, day: 16 }),
  createCalendarDate({ calendar: CALENDAR.ISLAMIC_UMALQURA, year: 1442, month: 9, day: 4 })
); // false

```
#### Start and end dates
The following functions can be used to find the start or end dates of a particular unit of time.

`startOfYear` – Returns the first day of the year for the given date.
`endOfYear` – Returns the last day of the year for the given date.
`startOfMonth` – Returns the first date of the month for the given date.
`endOfMonth` – Returns the last date of the month for the given date.
`startOfWeek` – Returns the first date of the week for the given date and locale.
`endOfWeek` – Returns the last date of the week for the given date and locale.

Note that `startOfWeek` and `endOfWeek` require a locale string to be provided. This is because the first day of the week changes depending on the locale. For example, in the United States, the first day of the week is on Sunday, but in France it is on Monday.

```js
import { startOfYear, startOfMonth, startOfWeek, createCalendarDate } from 'flat-internationalized-date';

let date = createCalendarDate({ year: 2022, month: 2, day: 3 });

startOfYear(date); // 2022-01-01
startOfMonth(date); // 2022-02-01
startOfWeek(date, 'en-US'); // 2022-01-30
startOfWeek(date, 'fr-FR'); // 2022-01-31
```

#### Day of week
The getDayOfWeek function returns the day of the week for the given date and locale. Days are numbered from zero to six, where zero is the first day of the week in the given locale. For example, in the United States, the first day of the week is Sunday, but in France it is Monday.

```js
import { getDayOfWeek, createCalendarDate } from 'flat-internationalized-date';

let date = createCalendarDate({ year: 2022, month: 2, day: 6 }); // a Sunday

getDayOfWeek(date, 'en-US'); // 0
getDayOfWeek(date, 'fr-FR'); // 6
```

#### Weekdays and weekends
The `isWeekday` and `isWeekend` functions can be used to determine if a date is weekday or weekend respectively. This depends on the locale. For example, in the United States, weekends are Saturday and Sunday, but in Israel they are Friday and Saturday.

```js
import { isWeekday, isWeekend, createCalendarDate } from 'flat-internationalized-date';

let date = createCalendarDate({ year: 2022, month: 2, day: 6 }); // a Sunday

isWeekday(date, 'en-US'); // false
isWeekday(date, 'he-IL'); // true

isWeekend(date, 'en-US'); // true
isWeekend(date, 'he-IL'); // false
```

#### Weeks in month
The `getWeeksInMonth` function returns the number of weeks in the given month. This depends on the number of days in the month, what day of the week the month starts on, and the given locale. For example, in the United States, the first day of the week is Sunday, but in France it is Monday.

```js
import { getWeeksInMonth, createCalendarDate } from 'flat-internationalized-date';

let date = createCalendarDate({ year: 2021, month: 1, day: 1 });

getWeeksInMonth(date, 'en-US'); // 6
getWeeksInMonth(date, 'fr-FR'); // 5
```

### DateFormatter

`DateFormatter` is a wrapper around the native Intl.DateTimeFormat API. It exposes the same API, but works around several browser bugs and provides polyfills for newer features. More details [here](https://react-spectrum.adobe.com/internationalized/date/DateFormatter.html)

## Development

### Install packages

``` pnpm i ```

### Lint

``` pnpm lint ```

### Run tests

``` pnpm test ```
