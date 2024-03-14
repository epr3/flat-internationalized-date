/** An interface that is compatible with any object with date fields. */
export declare type AnyCalendarDate = CalendarDate | CalendarDateTime | ZonedDateTime;

/** An interface that is compatible with any object with both date and time fields. */
export declare type AnyDateTime = AnyCalendarDate & AnyTime;

/** An interface that is compatible with any object with time fields. */
export declare interface AnyTime {
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    readonly millisecond: number;
}

declare function balanceDate(date: AnyCalendarDate): {
    calendar: string;
    era?: string | undefined;
    year: number;
    month: number;
    day: number;
} | {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    calendar: string;
    era?: string | undefined;
    year: number;
    month: number;
    day: number;
} | {
    timezone: string;
    offset: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    calendar: string;
    era?: string | undefined;
    year: number;
    month: number;
    day: number;
};

export declare const BuddhistCalendar: {
    name: string;
    fromJulianDay: typeof fromJulianDay_2;
    toJulianDay: typeof toJulianDay_2;
    getEras: typeof getEras_2;
    getDaysInMonth: typeof getDaysInMonth_2;
    balanceDate(date: AnyCalendarDate): AnyCalendarDate;
    getMonthsInYear: (_: AnyCalendarDate) => number;
    getDaysInYear: (date: AnyCalendarDate) => number;
    getYearsInEra: (_: AnyCalendarDate) => number;
    isInverseEra: (date: AnyCalendarDate) => boolean;
};

/**
 * The Calendar interface represents a calendar system, including information
 * about how days, months, years, and eras are organized, and methods to perform
 * arithmetic on dates.
 */
export declare interface Calendar {
    /** A string identifier for the calendar, as defined by Unicode CLDR. */
    name: string;
    /** Creates a CalendarDate in this calendar from the given Julian day number. */
    fromJulianDay(jd: number): CalendarDate;
    /** Converts a date in this calendar to a Julian day number. */
    toJulianDay(date: AnyCalendarDate): number;
    /** Returns the number of days in the month of the given date. */
    getDaysInMonth(date: AnyCalendarDate): number;
    /** Returns the number of months in the year of the given date. */
    getMonthsInYear(date: AnyCalendarDate): number;
    /** Returns the number of years in the era of the given date. */
    getYearsInEra(date: AnyCalendarDate): number;
    /** Returns a list of era identifiers for the calendar. */
    getEras(): string[];
    /** Returns the number of days in the year. */
    getDaysInYear?(date: AnyCalendarDate): number;
    /**
     * Returns the minimum month number of the given date's year.
     * Normally, this is 1, but in some calendars such as the Japanese,
     * eras may begin in the middle of a year.
     */
    getMinimumMonthInYear?(date: AnyCalendarDate): number;
    /**
     * Returns the minimum day number of the given date's month.
     * Normally, this is 1, but in some calendars such as the Japanese,
     * eras may begin in the middle of a month.
     */
    getMinimumDayInMonth?(date: AnyCalendarDate): number;
    balanceDate?(date: AnyCalendarDate): AnyCalendarDate;
    balanceYearMonth?(date: AnyCalendarDate, previousDate: AnyCalendarDate): AnyCalendarDate;
    constrainDate?(date: AnyCalendarDate): AnyCalendarDate;
    isInverseEra?(date: AnyCalendarDate): boolean;
}

/** A CalendarDate represents a date without any time components in a specific calendar system. */
export declare interface CalendarDate {
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
}

/** A CalendarDateTime represents a date and time without a time zone, in a specific calendar system. */
export declare interface CalendarDateTime extends CalendarDate {
    /** The hour in the day, numbered from 0 to 23. */
    readonly hour: number;
    /** The minute in the hour. */
    readonly minute: number;
    /** The second in the minute. */
    readonly second: number;
    /** The millisecond in the second. */
    readonly millisecond: number;
}

/**
 * The Coptic calendar is similar to the Ethiopic calendar.
 * It includes 12 months of 30 days each, plus 5 or 6 intercalary days depending
 * on whether it is a leap year. Two eras are supported: 'BCE' and 'CE'.
 */
export declare const CopticCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    isInverseEra(date: AnyCalendarDate): boolean;
    balanceDate(date: AnyCalendarDate): {
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    } | {
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    } | {
        timezone: string;
        offset: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    };
    getEras(): string[];
    getYearsInEra(date: AnyCalendarDate): number;
    getMonthsInYear(): number;
    getDaysInYear(date: AnyCalendarDate): number;
};

export declare function createCalendarDate({ calendar, era, year, month, day, }: {
    calendar?: string;
    era?: string;
    year: number;
    month: number;
    day: number;
}): CalendarDate;

export declare function createCalendarDateTime({ calendar, era, year, month, day, hour, minute, second, millisecond, }: {
    calendar?: string;
    era?: string;
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
}): CalendarDateTime;

export declare const createTime: ({ hour, minute, second, millisecond, }: {
    hour?: number | undefined;
    minute?: number | undefined;
    second?: number | undefined;
    millisecond?: number | undefined;
}) => Time;

export declare function createZonedDateTime({ calendar, era, year, month, day, hour, minute, second, millisecond, timezone, offset, }: {
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
}): ZonedDateTime;

export declare interface CycleOptions {
    /** Whether to round the field value to the nearest interval of the amount. */
    round?: boolean;
}

export declare interface CycleTimeOptions extends CycleOptions {
    /**
     * Whether to use 12 or 24 hour time. If 12 hour time is chosen, the resulting value
     * will remain in the same day period as the original value (e.g. if the value is AM,
     * the resulting value also be AM).
     * @default 24
     */
    hourCycle?: 12 | 24;
}

/** Represents an amount of time in calendar-specific units, for use when performing arithmetic. */
export declare interface DateDuration {
    /** The number of years to add or subtract. */
    years?: number;
    /** The number of months to add or subtract. */
    months?: number;
    /** The number of weeks to add or subtract. */
    weeks?: number;
    /** The number of days to add or subtract. */
    days?: number;
}

export declare type DateField = keyof DateFields;

export declare interface DateFields {
    era?: string;
    year?: number;
    month?: number;
    day?: number;
}

/** A wrapper around Intl.DateTimeFormat that fixes various browser bugs, and polyfills new features. */
export declare function DateFormatter(locale: string, options?: Intl.DateTimeFormatOptions): {
    formatter: Intl.DateTimeFormat;
    format: (value: Date) => string;
    formatToParts: (value: Date) => Intl.DateTimeFormatPart[];
    formatRange: (start: Date, end: Date) => string;
    formatRangeToParts: (start: Date, end: Date) => DateRangeFormatPart[];
    resolvedOptions: () => ResolvedDateTimeFormatOptions;
};

declare interface DateRangeFormatPart extends Intl.DateTimeFormatPart {
    source: "startRange" | "endRange" | "shared";
}

/** Represents an amount of time with both date and time components, for use when performing arithmetic. */
export declare interface DateTimeDuration extends DateDuration, TimeDuration {
}

declare type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime;

export declare type Disambiguation = "compatible" | "earlier" | "later" | "reject";

/** Returns the last date of the month for the given date. */
export declare function endOfMonth(date: ZonedDateTime): ZonedDateTime;

export declare function endOfMonth(date: CalendarDateTime): CalendarDateTime;

export declare function endOfMonth(date: CalendarDate): CalendarDate;

export declare function endOfMonth(date: DateValue): DateValue;

/** Returns the last date of the week for the given date and locale. */
export declare function endOfWeek(date: ZonedDateTime, locale: string): ZonedDateTime;

export declare function endOfWeek(date: CalendarDateTime, locale: string): CalendarDateTime;

export declare function endOfWeek(date: CalendarDate, locale: string): CalendarDate;

/** Returns the last day of the year for the given date. */
export declare function endOfYear(date: ZonedDateTime): ZonedDateTime;

export declare function endOfYear(date: CalendarDateTime): CalendarDateTime;

export declare function endOfYear(date: CalendarDate): CalendarDate;

export declare function endOfYear(date: DateValue): DateValue;

/**
 * The Ethiopic (Amete Alem) calendar is the same as the modern Ethiopic calendar,
 * except years were measured from a different epoch. Only one era is supported: 'AA'.
 */
export declare const EthiopicAmeteAlemCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    getEras(): string[];
    getYearsInEra(): number;
    toJulianDay(date: AnyCalendarDate): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    getMonthsInYear(): number;
    getDaysInYear(date: AnyCalendarDate): number;
    isInverseEra: (date: AnyCalendarDate) => boolean;
    balanceDate: (date: AnyCalendarDate) => {
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    } | {
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    } | {
        timezone: string;
        offset: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    };
};

/**
 * The Ethiopic calendar system is the official calendar used in Ethiopia.
 * It includes 12 months of 30 days each, plus 5 or 6 intercalary days depending
 * on whether it is a leap year. Two eras are supported: 'AA' and 'AM'.
 */
export declare const EthiopicCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    getMonthsInYear(): number;
    getDaysInYear(date: AnyCalendarDate): number;
    getYearsInEra(date: AnyCalendarDate): number;
    getEras(): string[];
    isInverseEra: (date: AnyCalendarDate) => boolean;
    balanceDate: (date: AnyCalendarDate) => {
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    } | {
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    } | {
        timezone: string;
        offset: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    };
};

/**
 * Takes a Unix epoch (milliseconds since 1970) and converts it to the provided time zone.
 */
export declare function fromAbsolute(ms: number, timezone: string): ZonedDateTime;

/**
 * Takes a `Date` object and converts it to the provided time zone.
 */
export declare function fromDate(date: Date, timeZone: string): ZonedDateTime;

/**
 * The Gregorian calendar is the most commonly used calendar system in the world. It supports two eras: BC, and AD.
 * Years always contain 12 months, and 365 or 366 days depending on whether it is a leap year.
 */
declare function fromJulianDay(jd: number): CalendarDate;

declare function fromJulianDay_2(jd: number): CalendarDate;

/**
 * Returns the day of week for the given date and locale. Days are numbered from zero to six,
 * where zero is the first day of the week in the given locale. For example, in the United States,
 * the first day of the week is Sunday, but in France it is Monday.
 */
export declare function getDayOfWeek(date: DateValue, locale: string): number;

declare function getDaysInMonth(date: AnyCalendarDate): number;

declare function getDaysInMonth_2(date: AnyCalendarDate): number;

declare function getDaysInYear(date: AnyCalendarDate): number;

declare function getEras(): string[];

declare function getEras_2(): string[];

/**
 * Returns the number of hours in the given date and time zone.
 * Usually this is 24, but it could be 23 or 25 if the date is on a daylight saving transition.
 */
export declare function getHoursInDay(a: CalendarDate, timeZone: string): number;

/** Returns the time zone identifier for the current user. */
export declare function getLocalTimeZone(): string;

export declare function getMinimumDayInMonth(date: AnyCalendarDate): number;

export declare function getMinimumMonthInYear(date: AnyCalendarDate): number;

declare function getMonthsInYear(_: AnyCalendarDate): number;

/** Returns the number of weeks in the given month and locale. */
export declare function getWeeksInMonth(date: DateValue, locale: string): number;

declare function getYearsInEra(_: AnyCalendarDate): number;

export declare const GregorianCalendar: {
    name: string;
    fromJulianDay: typeof fromJulianDay;
    toJulianDay: typeof toJulianDay;
    getDaysInMonth: typeof getDaysInMonth;
    getMonthsInYear: typeof getMonthsInYear;
    getDaysInYear: typeof getDaysInYear;
    getYearsInEra: typeof getYearsInEra;
    getEras: typeof getEras;
    isInverseEra: typeof isInverseEra;
    balanceDate: typeof balanceDate;
};

/**
 * The Hebrew calendar is used in Israel and around the world by the Jewish faith.
 * Years include either 12 or 13 months depending on whether it is a leap year.
 * In leap years, an extra month is inserted at month 6.
 */
export declare const HebrewCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    getMonthsInYear(date: AnyCalendarDate): number;
    getDaysInYear(date: AnyCalendarDate): number;
    getYearsInEra(): number;
    getEras(): string[];
    balanceYearMonth(date: AnyCalendarDate, previousDate: AnyCalendarDate): {
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    } | {
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    } | {
        timezone: string;
        offset: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        era?: string | undefined;
        year: number;
        month: number;
        day: number;
    };
};

/**
 * The Indian National Calendar is similar to the Gregorian calendar, but with
 * years numbered since the Saka era in 78 AD (Gregorian). There are 12 months
 * in each year, with either 30 or 31 days. Only one era identifier is supported: 'saka'.
 */
export declare const IndianCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    getYearsInEra(): number;
    getEras(): string[];
    balanceDate(date: AnyCalendarDate): AnyCalendarDate;
    getMonthsInYear: (_: AnyCalendarDate) => number;
    getDaysInYear: (date: AnyCalendarDate) => number;
    isInverseEra: (date: AnyCalendarDate) => boolean;
};

/** Returns whether the given dates occur on the same day, and are of the same calendar system. */
export declare function isEqualDay(a: DateValue, b: DateValue): boolean;

/** Returns whether the given dates occur in the same month, and are of the same calendar system. */
export declare function isEqualMonth(a: DateValue, b: DateValue): boolean;

/** Returns whether the given dates occur in the same year, and are of the same calendar system. */
export declare function isEqualYear(a: DateValue, b: DateValue): boolean;

declare function isInverseEra(date: AnyCalendarDate): boolean;

/**
 * The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab world.
 * The civil variant uses simple arithmetic rules rather than astronomical calculations to approximate
 * the traditional calendar, which is based on sighting of the crescent moon. It uses Friday, July 16 622 CE (Julian) as the epoch.
 * Each year has 12 months, with either 354 or 355 days depending on whether it is a leap year.
 * Learn more about the available Islamic calendars [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
 */
export declare const IslamicCivilCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    getMonthsInYear(): number;
    getDaysInYear(date: AnyCalendarDate): number;
    getYearsInEra(): number;
    getEras(): string[];
};

/**
 * The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab world.
 * The tabular variant uses simple arithmetic rules rather than astronomical calculations to approximate
 * the traditional calendar, which is based on sighting of the crescent moon. It uses Thursday, July 15 622 CE (Julian) as the epoch.
 * Each year has 12 months, with either 354 or 355 days depending on whether it is a leap year.
 * Learn more about the available Islamic calendars [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
 */
export declare const IslamicTabularCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    getMonthsInYear(): number;
    getDaysInYear(date: AnyCalendarDate): number;
    getYearsInEra(): number;
    getEras(): string[];
};

/**
 * The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab world.
 * The Umalqura variant is primarily used in Saudi Arabia. It is a lunar calendar, based on astronomical
 * calculations that predict the sighting of a crescent moon. Month and year lengths vary between years
 * depending on these calculations.
 * Learn more about the available Islamic calendars [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
 */
export declare const IslamicUmalquraCalendar: {
    name: string;
    constructCalendar(): void;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    getDaysInYear(date: AnyCalendarDate): number;
    getMonthsInYear(): number;
    getYearsInEra(): number;
    getEras(): string[];
};

/** Returns whether the given dates occur on the same day, regardless of the time or calendar system. */
export declare function isSameDay(a: DateValue, b: DateValue): boolean;

/** Returns whether the given dates occur in the same month, using the calendar system of the first date. */
export declare function isSameMonth(a: DateValue, b: DateValue): boolean;

/** Returns whether the given dates occur in the same year, using the calendar system of the first date. */
export declare function isSameYear(a: DateValue, b: DateValue): boolean;

/** Returns whether the date is today in the given time zone. */
export declare function isToday(date: DateValue, timeZone: string): boolean;

/** Returns whether the given date is on a weekday in the given locale. */
export declare function isWeekday(date: DateValue, locale: string): boolean;

/** Returns whether the given date is on a weekend in the given locale. */
export declare function isWeekend(date: DateValue, locale: string): boolean;

/**
 * The Japanese calendar is based on the Gregorian calendar, but with eras for the reign of each Japanese emperor.
 * Whenever a new emperor ascends to the throne, a new era begins and the year starts again from 1.
 * Note that eras before 1868 (Gregorian) are not currently supported by this implementation.
 */
export declare const JapaneseCalendar: Calendar;

/** Returns the greater of the two provider dates. */
export declare function maxDate<A extends DateValue, B extends DateValue>(a: A, b: B): A | B;

/** Returns the lesser of the two provider dates. */
export declare function minDate<A extends DateValue, B extends DateValue>(a: A, b: B): A | B;

/** Returns the current time in the given time zone. */
export declare function now(timeZone: string): ZonedDateTime;

/**
 * Parses an ISO 8601 date and time string with a UTC offset (e.g. "2021-11-07T07:45:00Z"
 * or "2021-11-07T07:45:00-07:00"). The result is converted to the provided time zone.
 */
export declare function parseAbsolute(value: string, timezone: string): ZonedDateTime;

/**
 * Parses an ISO 8601 date and time string with a UTC offset (e.g. "2021-11-07T07:45:00Z"
 * or "2021-11-07T07:45:00-07:00"). The result is converted to the user's local time zone.
 */
export declare function parseAbsoluteToLocal(value: string): ZonedDateTime;

/** Parses an ISO 8601 date string, with no time components. */
export declare function parseDate(value: string): CalendarDate;

/** Parses an ISO 8601 date and time string, with no time zone. */
export declare function parseDateTime(value: string): CalendarDateTime;

/**
 * Parses an ISO 8601 duration string (e.g. "P3Y6M6W4DT12H30M5S").
 * @param value An ISO 8601 duration string.
 * @returns A DateTimeDuration object.
 */
export declare function parseDuration(value: string): Required<DateTimeDuration>;

/** Parses an ISO 8601 time string. */
export declare function parseTime(value: string): Time;

/**
 * Parses an ISO 8601 date and time string with a time zone extension and optional UTC offset
 * (e.g. "2021-11-07T00:45[America/Los_Angeles]" or "2021-11-07T00:45-07:00[America/Los_Angeles]").
 * Ambiguous times due to daylight saving time transitions are resolved according to the `disambiguation`
 * parameter.
 */
export declare function parseZonedDateTime(value: string, disambiguation?: Disambiguation): ZonedDateTime;

/**
 * The Persian calendar is the main calendar used in Iran and Afghanistan. It has 12 months
 * in each year, the first 6 of which have 31 days, and the next 5 have 30 days. The 12th month
 * has either 29 or 30 days depending on whether it is a leap year. The Persian year starts
 * around the March equinox.
 */
export declare const PersianCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getMonthsInYear(): number;
    getDaysInMonth(date: AnyCalendarDate): number;
    getEras(): string[];
    getYearsInEra(): number;
};

declare interface ResolvedDateTimeFormatOptions extends Intl.ResolvedDateTimeFormatOptions {
    hourCycle?: Intl.DateTimeFormatOptions["hourCycle"];
}

/** Returns the first date of the month for the given date. */
export declare function startOfMonth(date: ZonedDateTime): ZonedDateTime;

export declare function startOfMonth(date: CalendarDateTime): CalendarDateTime;

export declare function startOfMonth(date: CalendarDate): CalendarDate;

export declare function startOfMonth(date: DateValue): DateValue;

/** Returns the first date of the week for the given date and locale. */
export declare function startOfWeek(date: ZonedDateTime, locale: string): ZonedDateTime;

export declare function startOfWeek(date: CalendarDateTime, locale: string): CalendarDateTime;

export declare function startOfWeek(date: CalendarDate, locale: string): CalendarDate;

export declare function startOfWeek(date: DateValue, locale: string): DateValue;

/** Returns the first day of the year for the given date. */
export declare function startOfYear(date: ZonedDateTime): ZonedDateTime;

export declare function startOfYear(date: CalendarDateTime): CalendarDateTime;

export declare function startOfYear(date: CalendarDate): CalendarDate;

export declare function startOfYear(date: DateValue): DateValue;

/**
 * The Taiwanese calendar is the same as the Gregorian calendar, but years
 * are numbered starting from 1912 (Gregorian). Two eras are supported:
 * 'before_minguo' and 'minguo'.
 */
export declare const TaiwanCalendar: {
    name: string;
    fromJulianDay(jd: number): CalendarDate;
    toJulianDay(date: AnyCalendarDate): number;
    getEras(): string[];
    balanceDate(date: AnyCalendarDate): {
        era: string;
        year: number;
        calendar: string;
        month: number;
        day: number;
    } | {
        era: string;
        year: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        month: number;
        day: number;
    } | {
        era: string;
        year: number;
        timezone: string;
        offset: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
        calendar: string;
        month: number;
        day: number;
    };
    isInverseEra(date: AnyCalendarDate): boolean;
    getDaysInMonth(date: AnyCalendarDate): number;
    getYearsInEra(date: AnyCalendarDate): number;
    getMonthsInYear: (_: AnyCalendarDate) => number;
    getDaysInYear: (date: AnyCalendarDate) => number;
};

export declare function temporalToString(date: Time | CalendarDate | CalendarDateTime | ZonedDateTime): string;

/** A Time represents a clock time without any date components. */
export declare interface Time {
    /** The hour, numbered from 0 to 23. */
    readonly hour: number;
    /** The minute in the hour. */
    readonly minute: number;
    /** The second in the minute. */
    readonly second: number;
    /** The millisecond in the second. */
    readonly millisecond: number;
}

/** Represents an amount of time, for use whe performing arithmetic. */
export declare interface TimeDuration {
    /** The number of hours to add or subtract. */
    hours?: number;
    /** The number of minutes to add or subtract. */
    minutes?: number;
    /** The number of seconds to add or subtract. */
    seconds?: number;
    /** The number of milliseconds to add or subtract. */
    milliseconds?: number;
}

export declare type TimeField = keyof TimeFields;

export declare interface TimeFields {
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
}

export declare function toAbsoluteString(date: ZonedDateTime): string;

/** Converts a date from one calendar system to another. */
export declare function toCalendar<T extends AnyCalendarDate>(date: T, calendar: string): T;

/** Converts a value with date components such as a `CalendarDateTime` or `ZonedDateTime` into a `CalendarDate`. */
export declare function toCalendarDate(dateTime: AnyCalendarDate): CalendarDate;

/**
 * Converts a date value to a `CalendarDateTime`. An optional `Time` value can be passed to set the time
 * of the resulting value, otherwise it will default to midnight.
 */
export declare function toCalendarDateTime(date: CalendarDate | CalendarDateTime | ZonedDateTime, time?: AnyTime): CalendarDateTime;

/** Returns today's date in the given time zone. */
export declare function today(timeZone: string): CalendarDate;

declare function toJulianDay(date: AnyCalendarDate): number;

declare function toJulianDay_2(date: AnyCalendarDate): number;

/** Converts the given `ZonedDateTime` into the user's local time zone. */
export declare function toLocalTimeZone(date: ZonedDateTime): ZonedDateTime;

/** Extracts the time components from a value containing a date and time. */
export declare function toTime(dateTime: CalendarDateTime | ZonedDateTime): Time;

/** Converts a `ZonedDateTime` from one time zone to another. */
export declare function toTimeZone(date: ZonedDateTime, timezone: string): ZonedDateTime;

/**
 * Converts a date value to a `ZonedDateTime` in the provided time zone. The `disambiguation` option can be set
 * to control how values that fall on daylight saving time changes are interpreted.
 */
export declare function toZoned(date: CalendarDate | CalendarDateTime | ZonedDateTime, timezone: string, disambiguation?: Disambiguation): ZonedDateTime;

/** A ZonedDateTime represents a date and time in a specific time zone and calendar system. */
export declare interface ZonedDateTime extends CalendarDateTime {
    /** The IANA time zone identifier that this date and time is represented in. */
    readonly timezone: string;
    /** The UTC offset for this time, in milliseconds. */
    readonly offset: number;
}

export { }
