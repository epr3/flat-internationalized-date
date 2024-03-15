import { GregorianCalendar } from "./GregorianCalendar";
import { BuddhistCalendar } from "./BuddhistCalendar";
import { HebrewCalendar } from "./HebrewCalendar";
import { IndianCalendar } from "./IndianCalendar";
import {
  CopticCalendar,
  EthiopicCalendar,
  EthiopicAmeteAlemCalendar,
} from "./EthiopicCalendar";
import {
  IslamicCivilCalendar,
  IslamicTabularCalendar,
  IslamicUmalquraCalendar,
} from "./IslamicCalendar";
import { JapaneseCalendar } from "./JapaneseCalendar";
import { PersianCalendar } from "./PersianCalendar";
import { TaiwanCalendar } from "./TaiwanCalendar";
import { Calendar } from "../types";
import { CALENDAR } from "./enum";

export const calendars: Record<CALENDAR, Calendar> = {
  [CALENDAR.GREGORIAN]: GregorianCalendar,
  [CALENDAR.BUDDHIST]: BuddhistCalendar,
  [CALENDAR.HEBREW]: HebrewCalendar,
  [CALENDAR.INDIAN]: IndianCalendar,
  [CALENDAR.COPTIC]: CopticCalendar,
  [CALENDAR.ETHIOPIC]: EthiopicCalendar,
  [CALENDAR.ETHIOPIC_AMETE_ALEM]: EthiopicAmeteAlemCalendar,
  [CALENDAR.ISLAMIC_CIVIL]: IslamicCivilCalendar,
  [CALENDAR.ISLAMIC_TABULAR]: IslamicTabularCalendar,
  [CALENDAR.ISLAMIC_UMALQURA]: IslamicUmalquraCalendar,
  [CALENDAR.JAPANESE]: JapaneseCalendar,
  [CALENDAR.PERSIAN]: PersianCalendar,
  [CALENDAR.TAIWAN]: TaiwanCalendar,
};

export {
  CALENDAR,
  GregorianCalendar,
  BuddhistCalendar,
  HebrewCalendar,
  IndianCalendar,
  CopticCalendar,
  EthiopicCalendar,
  EthiopicAmeteAlemCalendar,
  IslamicCivilCalendar,
  IslamicTabularCalendar,
  IslamicUmalquraCalendar,
  JapaneseCalendar,
  PersianCalendar,
  TaiwanCalendar,
};
