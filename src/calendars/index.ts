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

export const calendars: Record<string, Calendar> = {
  [GregorianCalendar.name]: GregorianCalendar,
  [BuddhistCalendar.name]: BuddhistCalendar,
  [HebrewCalendar.name]: HebrewCalendar,
  [IndianCalendar.name]: IndianCalendar,
  [CopticCalendar.name]: CopticCalendar,
  [EthiopicCalendar.name]: EthiopicCalendar,
  [EthiopicAmeteAlemCalendar.name]: EthiopicAmeteAlemCalendar,
  [IslamicCivilCalendar.name]: IslamicCivilCalendar,
  [IslamicTabularCalendar.name]: IslamicTabularCalendar,
  [IslamicUmalquraCalendar.name]: IslamicUmalquraCalendar,
  [JapaneseCalendar.name]: JapaneseCalendar,
  [PersianCalendar.name]: PersianCalendar,
  [TaiwanCalendar.name]: TaiwanCalendar,
};

export const supportedCalendars = Object.keys(calendars);
