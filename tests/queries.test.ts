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
  endOfMonth,
  endOfWeek,
  endOfYear,
  EthiopicCalendar,
  getDayOfWeek,
  getMinimumDayInMonth,
  getMinimumMonthInYear,
  getWeeksInMonth,
  isEqualDay,
  isEqualMonth,
  isEqualYear,
  IslamicUmalquraCalendar,
  isSameDay,
  isSameMonth,
  isSameYear,
  JapaneseCalendar,
  maxDate,
  minDate,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "..";

import { describe, it, expect } from "vitest";
import { createCalendarDate, createZonedDateTime } from "../src/CalendarDate";
import { compare } from "../src/queries";

describe("queries", function () {
  describe("isSameDay", function () {
    it("works with two dates in the same calendar", function () {
      expect(
        isSameDay(
          createCalendarDate({ year: 2020, month: 2, day: 3 }),
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        )
      ).toBe(true);
      expect(
        isSameDay(
          createCalendarDate({ year: 2019, month: 2, day: 3 }),
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        )
      ).toBe(false);
      expect(
        isSameDay(
          createCalendarDate({ year: 2020, month: 3, day: 3 }),
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        )
      ).toBe(false);
      expect(
        isSameDay(
          createCalendarDate({ year: 2020, month: 2, day: 4 }),
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        )
      ).toBe(false);
      expect(
        isSameDay(
          createCalendarDate({ era: "AD", year: 1, month: 1, day: 1 }),
          createCalendarDate({ era: "BC", year: 1, month: 1, day: 1 })
        )
      ).toBe(false);
    });

    it("works with two dates in different calendars", function () {
      expect(
        isSameDay(
          createCalendarDate({ year: 2021, month: 4, day: 16 }),
          createCalendarDate({
            calendar: IslamicUmalquraCalendar.name,
            year: 1442,
            month: 9,
            day: 4,
          })
        )
      ).toBe(true);
      expect(
        isSameDay(
          createCalendarDate({
            calendar: IslamicUmalquraCalendar.name,
            year: 1442,
            month: 9,
            day: 4,
          }),
          createCalendarDate({ year: 2021, month: 4, day: 16 })
        )
      ).toBe(true);
      expect(
        isSameDay(
          createCalendarDate({ year: 2019, month: 4, day: 16 }),
          createCalendarDate({
            calendar: IslamicUmalquraCalendar.name,
            year: 1442,
            month: 9,
            day: 4,
          })
        )
      ).toBe(false);
      expect(
        isSameDay(
          createCalendarDate({ year: 2021, month: 4, day: 16 }),
          createCalendarDate({
            calendar: IslamicUmalquraCalendar.name,
            year: 1441,
            month: 9,
            day: 4,
          })
        )
      ).toBe(false);
      expect(
        isSameDay(
          createCalendarDate({ year: 2021, month: 5, day: 16 }),
          createCalendarDate({
            calendar: IslamicUmalquraCalendar.name,
            year: 1442,
            month: 9,
            day: 4,
          })
        )
      ).toBe(false);
      expect(
        isSameDay(
          createCalendarDate({ year: 2021, month: 4, day: 16 }),
          createCalendarDate({
            calendar: IslamicUmalquraCalendar.name,
            year: 1442,
            month: 10,
            day: 4,
          })
        )
      ).toBe(false);
      expect(
        isSameDay(
          createCalendarDate({ year: 2021, month: 4, day: 17 }),
          createCalendarDate({
            calendar: IslamicUmalquraCalendar.name,
            year: 1442,
            month: 9,
            day: 4,
          })
        )
      ).toBe(false);
      expect(
        isSameDay(
          createCalendarDate({ year: 2021, month: 4, day: 16 }),
          createCalendarDate({
            calendar: IslamicUmalquraCalendar.name,
            year: 1442,
            month: 9,
            day: 3,
          })
        )
      ).toBe(false);
    });
  });

  describe("isSameMonth", function () {
    it("works with two dates in the same calendar", function () {
      expect(
        isSameMonth(
          createCalendarDate({ year: 2020, month: 2, day: 3 }),
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        )
      ).toBe(true);
      expect(
        isSameMonth(
          createCalendarDate({ year: 2019, month: 2, day: 3 }),
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        )
      ).toBe(false);
      expect(
        isSameMonth(
          createCalendarDate({ year: 2020, month: 3, day: 3 }),
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        )
      ).toBe(false);
      expect(
        isSameMonth(
          createCalendarDate({ year: 2020, month: 2, day: 4 }),
          createCalendarDate({ year: 2020, month: 2, day: 3 })
        )
      ).toBe(true);
    });
  });

  it("works with two dates in different calendars", function () {
    expect(
      isSameMonth(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(true);
    expect(
      isSameMonth(
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        }),
        createCalendarDate({ year: 2021, month: 4, day: 16 })
      )
    ).toBe(true);
    expect(
      isSameMonth(
        createCalendarDate({ year: 2019, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isSameMonth(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1441,
          month: 9,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isSameMonth(
        createCalendarDate({ year: 2021, month: 5, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isSameMonth(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 10,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isSameMonth(
        createCalendarDate({ year: 2021, month: 4, day: 17 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(true);
    expect(
      isSameMonth(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 3,
        })
      )
    ).toBe(true);
  });

  it("works with months that span different eras", function () {
    expect(
      isSameMonth(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        }),
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "heisei",
          year: 1,
          month: 1,
          day: 10,
        })
      )
    ).toBe(true);
    expect(
      isSameMonth(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        }),
        createCalendarDate({ year: 1989, month: 1, day: 10 })
      )
    ).toBe(true);
  });
});

describe("isSameYear", function () {
  it("works with two dates in the same calendar", function () {
    expect(
      isSameYear(
        createCalendarDate({ year: 2020, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
    expect(
      isSameYear(
        createCalendarDate({ year: 2019, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(false);
    expect(
      isSameYear(
        createCalendarDate({ year: 2020, month: 3, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
    expect(
      isSameYear(
        createCalendarDate({ year: 2020, month: 2, day: 4 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
  });

  it("works with two dates in different calendars", function () {
    expect(
      isSameYear(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(true);
    expect(
      isSameYear(
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        }),
        createCalendarDate({ year: 2021, month: 4, day: 16 })
      )
    ).toBe(true);
    expect(
      isSameYear(
        createCalendarDate({ year: 2019, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isSameYear(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1441,
          month: 9,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isSameYear(
        createCalendarDate({ year: 2021, month: 5, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(true);
    expect(
      isSameYear(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 10,
          day: 4,
        })
      )
    ).toBe(true);
    expect(
      isSameYear(
        createCalendarDate({ year: 2021, month: 4, day: 17 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(true);
    expect(
      isSameYear(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 3,
        })
      )
    ).toBe(true);
  });

  it("works with months that span different eras", function () {
    expect(
      isSameYear(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        }),
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "heisei",
          year: 1,
          month: 1,
          day: 10,
        })
      )
    ).toBe(true);
    expect(
      isSameYear(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        }),
        createCalendarDate({ year: 1989, month: 1, day: 10 })
      )
    ).toBe(true);
  });
});

describe("isEqualDay", function () {
  it("works with two dates in the same calendar", function () {
    expect(
      isEqualDay(
        createCalendarDate({ year: 2020, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
    expect(
      isEqualDay(
        createCalendarDate({ year: 2019, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(false);
    expect(
      isEqualDay(
        createCalendarDate({ year: 2020, month: 3, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(false);
    expect(
      isEqualDay(
        createCalendarDate({ year: 2020, month: 2, day: 4 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(false);
  });

  it("does not work with two dates in different calendars", function () {
    expect(
      isEqualDay(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isEqualDay(
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        }),
        createCalendarDate({ year: 2021, month: 4, day: 16 })
      )
    ).toBe(false);
  });
});

describe("isEqualMonth", function () {
  it("works with two dates in the same calendar", function () {
    expect(
      isEqualMonth(
        createCalendarDate({ year: 2020, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
    expect(
      isEqualMonth(
        createCalendarDate({ year: 2019, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(false);
    expect(
      isEqualMonth(
        createCalendarDate({ year: 2020, month: 3, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(false);
    expect(
      isEqualMonth(
        createCalendarDate({ year: 2020, month: 2, day: 4 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
  });

  it("does not work with two dates in different calendars", function () {
    expect(
      isEqualMonth(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isEqualMonth(
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        }),
        createCalendarDate({ year: 2021, month: 4, day: 16 })
      )
    ).toBe(false);
  });

  it("works with months that span different eras", function () {
    expect(
      isEqualMonth(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        }),
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "heisei",
          year: 1,
          month: 1,
          day: 10,
        })
      )
    ).toBe(true);
    expect(
      isEqualMonth(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        }),
        createCalendarDate({ year: 1989, month: 1, day: 10 })
      )
    ).toBe(false);
  });
});

describe("isEqualYear", function () {
  it("works with two dates in the same calendar", function () {
    expect(
      isEqualYear(
        createCalendarDate({ year: 2020, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
    expect(
      isEqualYear(
        createCalendarDate({ year: 2019, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(false);
    expect(
      isEqualYear(
        createCalendarDate({ year: 2020, month: 3, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
    expect(
      isEqualYear(
        createCalendarDate({ year: 2020, month: 2, day: 4 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(true);
  });

  it("does not work with two dates in different calendars", function () {
    expect(
      isEqualYear(
        createCalendarDate({ year: 2021, month: 4, day: 16 }),
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toBe(false);
    expect(
      isEqualYear(
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        }),
        createCalendarDate({ year: 2021, month: 4, day: 16 })
      )
    ).toBe(false);
  });

  it("works with months that span different eras", function () {
    expect(
      isEqualYear(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        }),
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "heisei",
          year: 1,
          month: 1,
          day: 10,
        })
      )
    ).toBe(true);
    expect(
      isEqualYear(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        }),
        createCalendarDate({ year: 1989, month: 1, day: 10 })
      )
    ).toBe(false);
  });
});

describe("startOfMonth", function () {
  it("moves the day to the first of the month", function () {
    expect(
      startOfMonth(createCalendarDate({ year: 2020, month: 2, day: 3 }))
    ).toEqual(createCalendarDate({ year: 2020, month: 2, day: 1 }));
    expect(
      startOfMonth(
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: IslamicUmalquraCalendar.name,
        year: 1442,
        month: 9,
        day: 1,
      })
    );
  });

  it("works in months that span eras", function () {
    expect(
      startOfMonth(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: JapaneseCalendar.name,
        era: "showa",
        year: 64,
        month: 1,
        day: 1,
      })
    );
    expect(
      startOfMonth(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "heisei",
          year: 1,
          month: 1,
          day: 10,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: JapaneseCalendar.name,
        era: "showa",
        year: 64,
        month: 1,
        day: 1,
      })
    );
  });

  it("works with zoned date times", function () {
    expect(
      startOfMonth(
        createZonedDateTime({
          year: 2021,
          month: 11,
          day: 10,
          timezone: "America/Los_Angeles",
          offset: -28800000,
          hour: 1,
          minute: 0,
          second: 0,
        })
      )
    ).toEqual(
      createZonedDateTime({
        year: 2021,
        month: 11,
        day: 1,
        timezone: "America/Los_Angeles",
        offset: -25200000,
        hour: 1,
        minute: 0,
        second: 0,
      })
    );
  });
});

describe("endOfMonth", function () {
  it("moves the day to the last day of the month", function () {
    expect(
      endOfMonth(createCalendarDate({ year: 2020, month: 2, day: 3 }))
    ).toEqual(createCalendarDate({ year: 2020, month: 2, day: 29 }));
    expect(
      endOfMonth(
        createCalendarDate({
          calendar: IslamicUmalquraCalendar.name,
          year: 1442,
          month: 9,
          day: 4,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: IslamicUmalquraCalendar.name,
        year: 1442,
        month: 9,
        day: 30,
      })
    );
  });

  it("works in years that span eras", function () {
    expect(
      endOfMonth(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: JapaneseCalendar.name,
        era: "heisei",
        year: 1,
        month: 1,
        day: 31,
      })
    );
    expect(
      endOfMonth(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "heisei",
          year: 1,
          month: 1,
          day: 10,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: JapaneseCalendar.name,
        era: "heisei",
        year: 1,
        month: 1,
        day: 31,
      })
    );
  });

  it("works with zoned date times", function () {
    expect(
      endOfMonth(
        createZonedDateTime({
          year: 2021,
          month: 11,
          day: 5,
          timezone: "America/Los_Angeles",
          offset: -25200000,
          hour: 1,
          minute: 0,
          second: 0,
        })
      )
    ).toEqual(
      createZonedDateTime({
        year: 2021,
        month: 11,
        day: 30,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      })
    );
  });
});

describe("startOfYear", function () {
  it("moves the day to the first of the year", function () {
    expect(
      startOfYear(createCalendarDate({ year: 2020, month: 2, day: 3 }))
    ).toEqual(createCalendarDate({ year: 2020, month: 1, day: 1 }));
  });

  it("works in years that span eras", function () {
    expect(
      startOfYear(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: JapaneseCalendar.name,
        era: "showa",
        year: 64,
        month: 1,
        day: 1,
      })
    );
    expect(
      startOfYear(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "heisei",
          year: 1,
          month: 5,
          day: 10,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: JapaneseCalendar.name,
        era: "showa",
        year: 64,
        month: 1,
        day: 1,
      })
    );
  });

  it("works with zoned date times", function () {
    expect(
      startOfYear(
        createZonedDateTime({
          year: 2021,
          month: 11,
          day: 5,
          timezone: "America/Los_Angeles",
          offset: -25200000,
          hour: 1,
          minute: 0,
          second: 0,
        })
      )
    ).toEqual(
      createZonedDateTime({
        year: 2021,
        month: 1,
        day: 1,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      })
    );
  });
});

describe("endOfYear", function () {
  it("moves the day to the last day of the year", function () {
    expect(
      endOfYear(createCalendarDate({ year: 2020, month: 2, day: 3 }))
    ).toEqual(createCalendarDate({ year: 2020, month: 12, day: 31 }));
  });

  it("works in years that span eras", function () {
    expect(
      endOfYear(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "showa",
          year: 64,
          month: 1,
          day: 3,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: JapaneseCalendar.name,
        era: "heisei",
        year: 1,
        month: 12,
        day: 31,
      })
    );
    expect(
      endOfYear(
        createCalendarDate({
          calendar: JapaneseCalendar.name,
          era: "heisei",
          year: 1,
          month: 5,
          day: 10,
        })
      )
    ).toEqual(
      createCalendarDate({
        calendar: JapaneseCalendar.name,
        era: "heisei",
        year: 1,
        month: 12,
        day: 31,
      })
    );
  });

  it("works with zoned date times", function () {
    expect(
      endOfYear(
        createZonedDateTime({
          year: 2021,
          month: 11,
          day: 5,
          timezone: "America/Los_Angeles",
          offset: -25200000,
          hour: 1,
          minute: 0,
          second: 0,
        })
      )
    ).toEqual(
      createZonedDateTime({
        year: 2021,
        month: 12,
        day: 31,
        timezone: "America/Los_Angeles",
        offset: -28800000,
        hour: 1,
        minute: 0,
        second: 0,
      })
    );
  });
});

describe("getDayOfWeek", function () {
  it("should return the day of week in en-US", function () {
    expect(
      getDayOfWeek(
        createCalendarDate({ year: 2021, month: 8, day: 4 }),
        "en-US"
      )
    ).toBe(3);
  });

  it("should return the day of week in fr-CA", function () {
    expect(
      getDayOfWeek(
        createCalendarDate({ year: 2021, month: 8, day: 4 }),
        "fr-CA"
      )
    ).toBe(3);
  });

  it("should return the day of week in fr-FR", function () {
    expect(
      getDayOfWeek(
        createCalendarDate({ year: 2021, month: 8, day: 4 }),
        "fr-FR"
      )
    ).toBe(2);
  });

  it("should return the day of week in fr", function () {
    expect(
      getDayOfWeek(createCalendarDate({ year: 2021, month: 8, day: 4 }), "fr")
    ).toBe(2);
  });
});

describe("startOfWeek", function () {
  it("should return the start of week in en-US", function () {
    expect(
      startOfWeek(createCalendarDate({ year: 2021, month: 8, day: 4 }), "en-US")
    ).toEqual(createCalendarDate({ year: 2021, month: 8, day: 1 }));
  });

  it("should return the start of week in fr-FR", function () {
    expect(
      startOfWeek(createCalendarDate({ year: 2021, month: 8, day: 4 }), "fr-FR")
    ).toEqual(createCalendarDate({ year: 2021, month: 8, day: 2 }));
  });
});

describe("endOfWeek", function () {
  it("should return the end of week in en-US", function () {
    expect(
      endOfWeek(createCalendarDate({ year: 2021, month: 8, day: 4 }), "en-US")
    ).toEqual(createCalendarDate({ year: 2021, month: 8, day: 7 }));
  });

  it("should return the end of week in fr-FR", function () {
    expect(
      endOfWeek(createCalendarDate({ year: 2021, month: 8, day: 4 }), "fr-FR")
    ).toEqual(createCalendarDate({ year: 2021, month: 8, day: 8 }));
  });
});

describe("getWeeksInMonth", function () {
  it("should work for months starting at the beginning of the week", function () {
    expect(
      getWeeksInMonth(
        createCalendarDate({ year: 2021, month: 8, day: 4 }),
        "en-US"
      )
    ).toBe(5);
  });

  it("should work for months starting at the end of the week", function () {
    expect(
      getWeeksInMonth(
        createCalendarDate({ year: 2021, month: 10, day: 4 }),
        "en-US"
      )
    ).toBe(6);
  });

  it("should work for other calendars", function () {
    expect(
      getWeeksInMonth(
        createCalendarDate({
          calendar: EthiopicCalendar.name,
          year: 2013,
          month: 13,
          day: 4,
        }),
        "en-US"
      )
    ).toBe(1);
  });
});

describe("getMinimumMonthInYear", function () {
  it("returns the minimum month of the year", function () {
    expect(
      getMinimumMonthInYear(
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toBe(1);
  });
});

describe("getMinimumDayInMonth", function () {
  it("returns the minimum day in a month", function () {
    expect(
      getMinimumDayInMonth(createCalendarDate({ year: 2020, month: 2, day: 3 }))
    ).toBe(1);
  });
});

describe("minDate", function () {
  it("should return the minimum date", function () {
    expect(
      minDate(
        createCalendarDate({ year: 2020, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 5, day: 3 })
      )
    ).toEqual(createCalendarDate({ year: 2020, month: 2, day: 3 }));
    expect(
      minDate(
        createCalendarDate({ year: 2020, month: 5, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toEqual(createCalendarDate({ year: 2020, month: 2, day: 3 }));
  });
});

describe("maxDate", function () {
  it("should return the maximum date", function () {
    expect(
      maxDate(
        createCalendarDate({ year: 2020, month: 2, day: 3 }),
        createCalendarDate({ year: 2020, month: 5, day: 3 })
      )
    ).toEqual(createCalendarDate({ year: 2020, month: 5, day: 3 }));
    expect(
      maxDate(
        createCalendarDate({ year: 2020, month: 5, day: 3 }),
        createCalendarDate({ year: 2020, month: 2, day: 3 })
      )
    ).toEqual(createCalendarDate({ year: 2020, month: 5, day: 3 }));
  });
});

describe("compare", function () {
  it("works with dates in different eras", function () {
    const a = createCalendarDate({ era: "BC", year: 1, month: 1, day: 1 });
    const b = createCalendarDate({ era: "AD", year: 1, month: 1, day: 1 });
    expect(compare(a, b)).toBeLessThan(0);
    expect(compare(b, a)).toBeGreaterThan(0);
  });
});
