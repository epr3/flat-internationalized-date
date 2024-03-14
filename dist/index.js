function M(n, e) {
  return n - e * Math.floor(n / e);
}
const ne = 1721426;
function S(n, e, r, t) {
  e = G(n, e);
  const o = e - 1;
  let a = -2;
  return r <= 2 ? a = 0 : A(e) && (a = -1), ne - 1 + 365 * o + Math.floor(o / 4) - Math.floor(o / 100) + Math.floor(o / 400) + Math.floor((367 * r - 362) / 12 + a + t);
}
function A(n) {
  return n % 4 === 0 && (n % 100 !== 0 || n % 400 === 0);
}
function G(n, e) {
  return n === "BC" ? 1 - e : e;
}
function un(n) {
  let e = "AD";
  return n <= 0 && (e = "BC", n = 1 - n), [e, n];
}
const Se = {
  standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
};
function Ye(n) {
  const e = n, r = e - ne, t = Math.floor(r / 146097), o = M(r, 146097), a = Math.floor(o / 36524), i = M(o, 36524), s = Math.floor(i / 1461), m = M(i, 1461), c = Math.floor(m / 365), y = t * 400 + a * 100 + s * 4 + c + (a !== 4 && c !== 4 ? 1 : 0), [D, g] = un(y), I = e - S(D, g, 1, 1);
  let R = 2;
  e < S(D, g, 3, 1) ? R = 0 : A(g) && (R = 1);
  const k = Math.floor(((I + R) * 12 + 373) / 367), C = e - S(D, g, k, 1) + 1;
  return h({ era: D, year: g, month: k, day: C });
}
function Re(n) {
  return S(n.era, n.year, n.month, n.day);
}
function Je(n) {
  return Se[A(n.year) ? "leapyear" : "standard"][n.month - 1];
}
function Be(n) {
  return 12;
}
function Ue(n) {
  return A(n.year) ? 366 : 365;
}
function Oe(n) {
  return 9999;
}
function Le() {
  return ["BC", "AD"];
}
function _e(n) {
  return n.era === "BC";
}
function Qe(n) {
  let e = { ...n };
  return e.year <= 0 && (e = {
    ...e,
    era: e.era === "BC" ? "AD" : "BC",
    year: 1 - e.year
  }), e;
}
const f = {
  name: "gregorian",
  fromJulianDay: Ye,
  toJulianDay: Re,
  getDaysInMonth: Je,
  getMonthsInYear: Be,
  getDaysInYear: Ue,
  getYearsInEra: Oe,
  getEras: Le,
  isInverseEra: _e,
  balanceDate: Qe
}, ee = -543;
function re(n) {
  const [e, r] = un(n.year + ee);
  return h({
    era: e,
    year: r,
    month: n.month,
    day: n.day
  });
}
function Fe(n) {
  const e = f.fromJulianDay(n), r = G(e.era, e.year);
  return h({
    calendar: "buddhist",
    year: r - ee,
    month: e.month,
    day: e.day
  });
}
function $e(n) {
  return f.toJulianDay(re(n));
}
function ke() {
  return ["BE"];
}
function qe(n) {
  return f.getDaysInMonth(re(n));
}
const Bn = {
  ...f,
  name: "buddhist",
  fromJulianDay: Fe,
  toJulianDay: $e,
  getEras: ke,
  getDaysInMonth: qe,
  balanceDate(n) {
    return n;
  }
}, Un = 347997, te = 1080, oe = 24 * te, Ne = 29, xe = 12 * te + 793, ve = Ne * oe + xe;
function p(n) {
  return M(n * 7 + 1, 19) < 7;
}
function V(n) {
  const e = Math.floor((235 * n - 234) / 19), r = 12084 + 13753 * e;
  let t = e * 29 + Math.floor(r / 25920);
  return M(3 * (t + 1), 7) < 3 && (t += 1), t;
}
function Ge(n) {
  const e = V(n - 1), r = V(n);
  return V(n + 1) - r === 356 ? 2 : r - e === 382 ? 1 : 0;
}
function N(n) {
  return V(n) + Ge(n);
}
function ae(n) {
  return N(n + 1) - N(n);
}
function He(n) {
  let e = ae(n);
  switch (e > 380 && (e -= 30), e) {
    case 353:
      return 0;
    case 354:
      return 1;
    case 355:
      return 2;
  }
}
function W(n, e) {
  if (e >= 6 && !p(n) && e++, e === 4 || e === 7 || e === 9 || e === 11 || e === 13)
    return 29;
  const r = He(n);
  return e === 2 ? r === 2 ? 30 : 29 : e === 3 ? r === 0 ? 29 : 30 : e === 6 ? p(n) ? 30 : 0 : 30;
}
const On = {
  name: "hebrew",
  fromJulianDay(n) {
    const e = n - Un, r = e * oe / ve;
    let t = Math.floor((19 * r + 234) / 235) + 1, o = N(t), a = Math.floor(e - o);
    for (; a < 1; )
      t--, o = N(t), a = Math.floor(e - o);
    let i = 1, s = 0;
    for (; s < a; )
      s += W(t, i), i++;
    i--, s -= W(t, i);
    const m = a - s;
    return h({ calendar: "hebrew", year: t, month: i, day: m });
  },
  toJulianDay(n) {
    let e = N(n.year);
    for (let r = 1; r < n.month; r++)
      e += W(n.year, r);
    return e + n.day + Un;
  },
  getDaysInMonth(n) {
    return W(n.year, n.month);
  },
  getMonthsInYear(n) {
    return p(n.year) ? 13 : 12;
  },
  getDaysInYear(n) {
    return ae(n.year);
  },
  getYearsInEra() {
    return 9999;
  },
  getEras() {
    return ["AM"];
  },
  balanceYearMonth(n, e) {
    let r = { ...n };
    return e.year !== n.year && (p(e.year) && !p(n.year) && e.month > 6 ? r = {
      ...r,
      month: n.month - 1
    } : !p(e.year) && p(n.year) && e.month > 6 && (r = {
      ...r,
      month: n.month + 1
    })), r;
  }
}, mn = 78, Ln = 80, _n = {
  ...f,
  name: "indian",
  fromJulianDay(n) {
    const e = f.fromJulianDay(n);
    let r = e.year - mn, t = n - S(e.era, e.year, 1, 1), o;
    t < Ln ? (r--, o = A(e.year - 1) ? 31 : 30, t += o + 31 * 5 + 30 * 3 + 10) : (o = A(e.year) ? 31 : 30, t -= Ln);
    let a, i;
    if (t < o)
      a = 1, i = t + 1;
    else {
      let s = t - o;
      s < 31 * 5 ? (a = Math.floor(s / 31) + 2, i = s % 31 + 1) : (s -= 31 * 5, a = Math.floor(s / 30) + 7, i = s % 30 + 1);
    }
    return h({
      calendar: "indian",
      year: r,
      month: a,
      day: i
    });
  },
  toJulianDay(n) {
    const e = n.year + mn, [r, t] = un(e);
    let o, a;
    return A(t) ? (o = 31, a = S(r, t, 3, 21)) : (o = 30, a = S(r, t, 3, 22)), n.month === 1 ? a + n.day - 1 : (a += o + Math.min(n.month - 2, 5) * 31, n.month >= 8 && (a += (n.month - 7) * 30), a += n.day - 1, a);
  },
  getDaysInMonth(n) {
    return n.month === 1 && A(n.year + mn) || n.month >= 2 && n.month <= 6 ? 31 : 30;
  },
  getYearsInEra() {
    return 9919;
  },
  getEras() {
    return ["saka"];
  },
  balanceDate(n) {
    return n;
  }
}, Dn = 1723856, Qn = 1824665, Mn = 5500;
function z(n, e, r, t) {
  return n + // difference from Julian epoch to 1,1,1
  365 * e + // number of days from years
  Math.floor(e / 4) + // extra day of leap year
  30 * (r - 1) + // number of days from months (1 based)
  t - 1;
}
function Cn(n, e) {
  const r = Math.floor(4 * (e - n) / 1461), t = 1 + Math.floor((e - z(n, r, 1, 1)) / 30), o = e + 1 - z(n, r, t, 1);
  return [r, t, o];
}
function ie(n) {
  return Math.floor(n % 4 / 3);
}
function se(n, e) {
  return e % 13 !== 0 ? 30 : ie(n) + 5;
}
const j = {
  ...f,
  name: "ethiopic",
  fromJulianDay(n) {
    let [e, r, t] = Cn(Dn, n), o = "AM";
    return e <= 0 && (o = "AA", e += Mn), h({ calendar: "ethiopic", era: o, year: e, month: r, day: t });
  },
  toJulianDay(n) {
    let e = n.year;
    return n.era === "AA" && (e -= Mn), z(Dn, e, n.month, n.day);
  },
  getDaysInMonth(n) {
    return se(n.year, n.month);
  },
  getMonthsInYear() {
    return 13;
  },
  getDaysInYear(n) {
    return 365 + ie(n.year);
  },
  getYearsInEra(n) {
    return n.era === "AA" ? 9999 : 9991;
  },
  getEras() {
    return ["AA", "AM"];
  }
}, Fn = {
  ...j,
  name: "ethioaa",
  // also known as 'ethiopic-amete-alem' in ICU
  fromJulianDay(n) {
    let [e, r, t] = Cn(Dn, n);
    return e += Mn, h({
      calendar: "ethioaa",
      era: "AA",
      year: e,
      month: r,
      day: t
    });
  },
  getEras() {
    return ["AA"];
  },
  getYearsInEra() {
    return 9999;
  }
}, $n = {
  ...j,
  name: "coptic",
  fromJulianDay(n) {
    let [e, r, t] = Cn(Qn, n), o = "CE";
    return e <= 0 && (o = "BCE", e = 1 - e), h({ calendar: "coptic", era: o, year: e, month: r, day: t });
  },
  toJulianDay(n) {
    let e = n.year;
    return n.era === "BCE" && (e = 1 - e), z(Qn, e, n.month, n.day);
  },
  getDaysInMonth(n) {
    let e = n.year;
    return n.era === "BCE" && (e = 1 - e), se(e, n.month);
  },
  isInverseEra(n) {
    return n.era === "BCE";
  },
  balanceDate(n) {
    let e = { ...n };
    return e.year <= 0 && (e = {
      ...e,
      year: 1 - e.year,
      era: e.era === "BCE" ? "CE" : "BCE"
    }), e;
  },
  getEras() {
    return ["BCE", "CE"];
  },
  getYearsInEra(n) {
    return n.era === "BCE" ? 9999 : 9715;
  }
}, X = 1948440, kn = 1948439, d = 1300, B = 1600, We = 460322;
function nn(n, e, r, t) {
  return t + Math.ceil(29.5 * (r - 1)) + (e - 1) * 354 + Math.floor((3 + 11 * e) / 30) + n - 1;
}
function ue(n, e, r) {
  const t = Math.floor((30 * (r - e) + 10646) / 10631), o = Math.min(
    12,
    Math.ceil((r - (29 + nn(e, t, 1, 1))) / 29.5) + 1
  ), a = r - nn(e, t, o, 1) + 1;
  return h({ calendar: n, year: t, month: o, day: a });
}
function qn(n) {
  return (14 + 11 * n) % 30 < 11;
}
const E = {
  name: "islamic-civil",
  fromJulianDay(n) {
    return ue("islamic-civil", X, n);
  },
  toJulianDay(n) {
    return nn(X, n.year, n.month, n.day);
  },
  getDaysInMonth(n) {
    let e = 29 + n.month % 2;
    return n.month === 12 && qn(n.year) && e++, e;
  },
  getMonthsInYear() {
    return 12;
  },
  getDaysInYear(n) {
    return qn(n.year) ? 355 : 354;
  },
  getYearsInEra() {
    return 9665;
  },
  getEras() {
    return ["AH"];
  }
}, Nn = {
  ...E,
  name: "islamic-tbla",
  fromJulianDay(n) {
    return ue("islamic-tbla", kn, n);
  },
  toJulianDay(n) {
    return nn(
      kn,
      n.year,
      n.month,
      n.day
    );
  }
}, Pe = "qgpUDckO1AbqBmwDrQpVBakGkgepC9QF2gpcBS0NlQZKB1QLagutBa4ETwoXBYsGpQbVCtYCWwmdBE0KJg2VDawFtgm6AlsKKwWVCsoG6Qr0AnYJtgJWCcoKpAvSC9kF3AJtCU0FpQpSC6ULtAW2CVcFlwJLBaMGUgdlC2oFqworBZUMSg2lDcoF1gpXCasESwmlClILagt1BXYCtwhbBFUFqQW0BdoJ3QRuAjYJqgpUDbIN1QXaAlsJqwRVCkkLZAtxC7QFtQpVCiUNkg7JDtQG6QprCasEkwpJDaQNsg25CroEWworBZUKKgtVC1wFvQQ9Ah0JlQpKC1oLbQW2AjsJmwRVBqkGVAdqC2wFrQpVBSkLkgupC9QF2gpaBasKlQVJB2QHqgu1BbYCVgpNDiULUgtqC60FrgIvCZcESwalBqwG1gpdBZ0ETQoWDZUNqgW1BdoCWwmtBJUFygbkBuoK9QS2AlYJqgpUC9IL2QXqAm0JrQSVCkoLpQuyBbUJ1gSXCkcFkwZJB1ULagVrCisFiwpGDaMNygXWCtsEawJLCaUKUgtpC3UFdgG3CFsCKwVlBbQF2gntBG0BtgimClINqQ3UBdoKWwmrBFMGKQdiB6kLsgW1ClUFJQuSDckO0gbpCmsFqwRVCikNVA2qDbUJugQ7CpsETQqqCtUK2gJdCV4ELgqaDFUNsga5BroEXQotBZUKUguoC7QLuQXaAloJSgukDdEO6AZqC20FNQWVBkoNqA3UDdoGWwWdAisGFQtKC5ULqgWuCi4JjwwnBZUGqgbWCl0FnQI=";
let In, U;
function Z(n) {
  return We + U[n - d];
}
function q(n, e) {
  const r = n - d, t = 1 << 11 - (e - 1);
  return In[r] & t ? 30 : 29;
}
function xn(n, e) {
  let r = Z(n);
  for (let t = 1; t < e; t++)
    r += q(n, t);
  return r;
}
function vn(n) {
  return U[n + 1 - d] - U[n - d];
}
const En = {
  ...E,
  name: "islamic-umalqura",
  constructCalendar() {
    if (In || (In = new Uint16Array(
      Uint8Array.from(atob(Pe), (n) => n.charCodeAt(0)).buffer
    )), !U) {
      U = new Uint32Array(
        B - d + 1
      );
      let n = 0;
      for (let e = d; e <= B; e++) {
        U[e - d] = n;
        for (let r = 1; r <= 12; r++)
          n += q(e, r);
      }
    }
  },
  fromJulianDay(n) {
    const e = n - X, r = Z(d), t = Z(B);
    if (e < r || e > t)
      return E.fromJulianDay(n);
    {
      let o = d - 1, a = 1, i = 1;
      for (; i > 0; ) {
        o++, i = e - Z(o) + 1;
        const s = vn(o);
        if (i === s) {
          a = 12;
          break;
        } else if (i < s) {
          let m = q(o, a);
          for (a = 1; i > m; )
            i -= m, a++, m = q(o, a);
          break;
        }
      }
      return h({
        calendar: "islamic-umalqura",
        year: o,
        month: a,
        day: e - xn(o, a) + 1
      });
    }
  },
  toJulianDay(n) {
    return n.year < d || n.year > B ? E.toJulianDay(n) : X + xn(n.year, n.month) + (n.day - 1);
  },
  getDaysInMonth(n) {
    return n.year < d || n.year > B ? E.getDaysInMonth(n) : q(n.year, n.month);
  },
  getDaysInYear(n) {
    return n.year < d || n.year > B ? E.getDaysInYear(n) : vn(n.year);
  }
}, L = [
  [1868, 9, 8],
  [1912, 7, 30],
  [1926, 12, 25],
  [1989, 1, 8],
  [2019, 5, 1]
], be = [
  [1912, 7, 29],
  [1926, 12, 24],
  [1989, 1, 7],
  [2019, 4, 30]
], en = [1867, 1911, 1925, 1988, 2018], T = ["meiji", "taisho", "showa", "heisei", "reiwa"];
function Gn(n) {
  const e = L.findIndex(([r, t, o]) => n.year < r || n.year === r && n.month < t || n.year === r && n.month === t && n.day < o);
  return e === -1 ? L.length - 1 : e === 0 ? 0 : e - 1;
}
function fn(n) {
  const e = en[T.indexOf(n.era)];
  if (!e)
    throw new Error("Unknown era: " + n.era);
  return h({
    year: n.year + e,
    month: n.month,
    day: n.day
  });
}
function Hn(n) {
  if (n.year === 1) {
    const e = T.indexOf(n.era);
    return L[e];
  }
}
function Wn(n) {
  let e = { ...n };
  const r = T.indexOf(n.era), t = be[r];
  if (console.log(r), t) {
    const [o, a, i] = t, s = o - en[r];
    e = {
      ...e,
      year: Math.max(1, Math.min(s, e.year))
    }, e.year === s && (e = {
      ...e,
      month: Math.max(1, Math.min(a, e.month))
    }, e.month === a && (e = {
      ...e,
      day: Math.max(1, Math.min(i, e.day))
    }));
  }
  if (n.year === 1 && r >= 0) {
    const [, o, a] = L[r];
    e = {
      ...e,
      month: Math.max(o, e.month)
    }, e.month === o && (e = {
      ...e,
      day: Math.max(a, e.day)
    });
  }
  return e;
}
const Pn = {
  ...f,
  name: "japanese",
  fromJulianDay(n) {
    const e = f.fromJulianDay(n), r = Gn(e);
    return h({
      calendar: "japanese",
      era: T[r],
      year: e.year - en[r],
      month: e.month,
      day: e.day
    });
  },
  toJulianDay(n) {
    return f.toJulianDay(fn(n));
  },
  balanceDate(n) {
    let e = { ...n };
    const r = fn(n), t = Gn(r);
    return T[t] !== n.era && (e = {
      ...e,
      era: T[t],
      year: r.year - en[t]
    }), Wn(e);
  },
  constrainDate: Wn,
  getEras() {
    return T;
  },
  getYearsInEra(n) {
    const e = T.indexOf(n.era), r = L[e], t = L[e + 1];
    if (t == null)
      return 9999 - r[0] + 1;
    let o = t[0] - r[0];
    return (n.month < t[1] || n.month === t[1] && n.day < t[2]) && o++, o;
  },
  getDaysInMonth(n) {
    return f.getDaysInMonth(fn(n));
  },
  getMinimumMonthInYear(n) {
    const e = Hn(n);
    return e ? e[1] : 1;
  },
  getMinimumDayInMonth(n) {
    const e = Hn(n);
    return e && n.month === e[1] ? e[2] : 1;
  }
}, Ke = 1948321;
function Ve(n) {
  const e = n > 0 ? n - 474 : n - 473, r = M(e, 2820) + 474;
  return M((r + 38) * 31, 128) < 31;
}
function P(n, e, r) {
  const t = n > 0 ? n - 474 : n - 473, o = M(t, 2820) + 474, a = e <= 7 ? 31 * (e - 1) : 30 * (e - 1) + 6;
  return Ke - 1 + 1029983 * Math.floor(t / 2820) + 365 * (o - 1) + Math.floor((31 * o - 5) / 128) + a + r;
}
const bn = {
  name: "persian",
  fromJulianDay(n) {
    const e = n - P(475, 1, 1), r = Math.floor(e / 1029983), t = M(e, 1029983), o = t === 1029982 ? 2820 : Math.floor((128 * t + 46878) / 46751);
    let a = 474 + 2820 * r + o;
    a <= 0 && a--;
    const i = n - P(a, 1, 1) + 1, s = i <= 186 ? Math.ceil(i / 31) : Math.ceil((i - 6) / 31), m = n - P(a, s, 1) + 1;
    return h({ calendar: "persian", year: a, month: s, day: m });
  },
  toJulianDay(n) {
    return P(n.year, n.month, n.day);
  },
  getMonthsInYear() {
    return 12;
  },
  getDaysInMonth(n) {
    return n.month <= 6 ? 31 : n.month <= 11 || Ve(n.year) ? 30 : 29;
  },
  getEras() {
    return ["AP"];
  },
  getYearsInEra() {
    return 9377;
  }
}, rn = 1911;
function ce(n) {
  return n.era === "minguo" ? n.year + rn : 1 - n.year + rn;
}
function Kn(n) {
  const e = n - rn;
  return e > 0 ? ["minguo", e] : ["before_minguo", 1 - e];
}
function Vn(n) {
  const [e, r] = un(ce(n));
  return h({
    era: e,
    year: r,
    month: n.month,
    day: n.day
  });
}
const Zn = {
  ...f,
  name: "roc",
  // Republic of China
  fromJulianDay(n) {
    const e = f.fromJulianDay(n), r = G(e.era, e.year), [t, o] = Kn(r);
    return h({
      calendar: "roc",
      era: t,
      year: o,
      month: e.month,
      day: e.day
    });
  },
  toJulianDay(n) {
    return f.toJulianDay(Vn(n));
  },
  getEras() {
    return ["before_minguo", "minguo"];
  },
  balanceDate(n) {
    const [e, r] = Kn(ce(n));
    return { ...n, era: e, year: r };
  },
  isInverseEra(n) {
    return n.era === "before_minguo";
  },
  getDaysInMonth(n) {
    return f.getDaysInMonth(Vn(n));
  },
  getYearsInEra(n) {
    return n.era === "before_minguo" ? 9999 : 9999 - rn;
  }
}, u = {
  [f.name]: f,
  [Bn.name]: Bn,
  [On.name]: On,
  [_n.name]: _n,
  [$n.name]: $n,
  [j.name]: j,
  [Fn.name]: Fn,
  [E.name]: E,
  [Nn.name]: Nn,
  [En.name]: En,
  [Pn.name]: Pn,
  [bn.name]: bn,
  [Zn.name]: Zn
}, Ze = {
  "001": 1,
  AD: 1,
  AE: 6,
  AF: 6,
  AI: 1,
  AL: 1,
  AM: 1,
  AN: 1,
  AR: 1,
  AT: 1,
  AU: 1,
  AX: 1,
  AZ: 1,
  BA: 1,
  BE: 1,
  BG: 1,
  BH: 6,
  BM: 1,
  BN: 1,
  BY: 1,
  CH: 1,
  CL: 1,
  CM: 1,
  CN: 1,
  CR: 1,
  CY: 1,
  CZ: 1,
  DE: 1,
  DJ: 6,
  DK: 1,
  DZ: 6,
  EC: 1,
  EE: 1,
  EG: 6,
  ES: 1,
  FI: 1,
  FJ: 1,
  FO: 1,
  FR: 1,
  GB: 1,
  GE: 1,
  GF: 1,
  GP: 1,
  GR: 1,
  HR: 1,
  HU: 1,
  IE: 1,
  IQ: 6,
  IR: 6,
  IS: 1,
  IT: 1,
  JO: 6,
  KG: 1,
  KW: 6,
  KZ: 1,
  LB: 1,
  LI: 1,
  LK: 1,
  LT: 1,
  LU: 1,
  LV: 1,
  LY: 6,
  MC: 1,
  MD: 1,
  ME: 1,
  MK: 1,
  MN: 1,
  MQ: 1,
  MV: 5,
  MY: 1,
  NL: 1,
  NO: 1,
  NZ: 1,
  OM: 6,
  PL: 1,
  QA: 6,
  RE: 1,
  RO: 1,
  RS: 1,
  RU: 1,
  SD: 6,
  SE: 1,
  SI: 1,
  SK: 1,
  SM: 1,
  SY: 6,
  TJ: 1,
  TM: 1,
  TR: 1,
  UA: 1,
  UY: 1,
  UZ: 1,
  VA: 1,
  VN: 1,
  XK: 1
};
function ze(n, e) {
  return e = w(e, n.calendar), n.era === e.era && n.year === e.year && n.month === e.month && n.day === e.day;
}
function Br(n, e) {
  return e = w(e, n.calendar), n = _(n), e = _(e), n.era === e.era && n.year === e.year && n.month === e.month;
}
function Ur(n, e) {
  return e = w(e, n.calendar), n = tn(n), e = tn(e), n.era === e.era && n.year === e.year;
}
function Or(n, e) {
  return n.calendar === e.calendar && n.era === e.era && n.year === e.year && n.month === e.month && n.day === e.day;
}
function Lr(n, e) {
  return n = _(n), e = _(e), n.calendar === e.calendar && n.era === e.era && n.year === e.year && n.month === e.month;
}
function _r(n, e) {
  return n = tn(n), e = tn(e), n.calendar === e.calendar && n.era === e.era && n.year === e.year;
}
function Qr(n, e) {
  return ze(n, Xe(e));
}
function le(n, e) {
  const r = u[n.calendar].toJulianDay(n);
  let t = Math.ceil(r + 1 - or(e)) % 7;
  return t < 0 && (t += 7), t;
}
function je(n) {
  return F(Date.now(), n);
}
function Xe(n) {
  return cr(je(n));
}
function nr(n, e) {
  return u[n.calendar].toJulianDay(n) - u[e.calendar].toJulianDay(e);
}
function er(n, e) {
  return zn(n) - zn(e);
}
function zn(n) {
  return n.hour * 60 * 60 * 1e3 + n.minute * 60 * 1e3 + n.second * 1e3 + n.millisecond;
}
function Fr(n, e) {
  const r = Q(n, e), t = $(n, { days: 1 });
  return (Q(t, e) - r) / 36e5;
}
let hn = null;
function cn() {
  return hn == null && (hn = new Intl.DateTimeFormat().resolvedOptions().timeZone), hn;
}
function _(n) {
  return Sn(n, { days: n.day - 1 });
}
function rr(n) {
  return $(n, {
    days: u[n.calendar].getDaysInMonth(n) - n.day
  });
}
function tn(n) {
  return _(Sn(n, { months: n.month - 1 }));
}
function $r(n) {
  return rr(
    $(n, {
      months: u[n.calendar].getMonthsInYear(n) - n.month
    })
  );
}
function kr(n) {
  return u[n.calendar].getMinimumMonthInYear ? u[n.calendar].getMinimumMonthInYear(n) : 1;
}
function qr(n) {
  return u[n.calendar].getMinimumDayInMonth ? u[n.calendar].getMinimumDayInMonth(n) : 1;
}
function tr(n, e) {
  const r = le(n, e);
  return Sn(n, { days: r });
}
function Nr(n, e) {
  return $(tr(n, e), { days: 6 });
}
const jn = /* @__PURE__ */ new Map();
function me(n) {
  if (Intl.Locale) {
    let r = jn.get(n);
    return r || (r = new Intl.Locale(n).maximize().region, r && jn.set(n, r)), r;
  }
  const e = n.split("-")[1];
  return e === "u" ? void 0 : e;
}
function or(n) {
  const e = me(n);
  return e && Ze[e] || 0;
}
function xr(n, e) {
  const r = u[n.calendar].getDaysInMonth(n);
  return Math.ceil((le(_(n), e) + r) / 7);
}
function fe(n, e) {
  if (x(n)) {
    if (x(e))
      return b(n, n.timezone).getTime() - b(e, e.timezone).getTime();
    if (O(e))
      return b(n, n.timezone).getTime() - b(e, n.timezone).getTime();
    throw new Error("Cannot compare a ZonedDateTime with a Time value");
  }
  let r = 0;
  return on(n) && on(e) && (r = nr(n, e)), O(n) && O(e) && r === 0 || Tn(n) && Tn(e) ? er(n, e) : r;
}
function vr(n, e) {
  return n && e ? fe(n, e) <= 0 ? n : e : n || e;
}
function Gr(n, e) {
  return n && e ? fe(n, e) >= 0 ? n : e : n || e;
}
const ar = {
  AF: [4, 5],
  AE: [5, 6],
  BH: [5, 6],
  DZ: [5, 6],
  EG: [5, 6],
  IL: [5, 6],
  IQ: [5, 6],
  IR: [5, 5],
  JO: [5, 6],
  KW: [5, 6],
  LY: [5, 6],
  OM: [5, 6],
  QA: [5, 6],
  SA: [5, 6],
  SD: [5, 6],
  SY: [5, 6],
  YE: [5, 6]
};
function ir(n, e) {
  const r = u[n.calendar].toJulianDay(n);
  let t = Math.ceil(r + 1) % 7;
  t < 0 && (t += 7);
  const o = me(e), [a, i] = ar[o] || [
    6,
    0
  ];
  return t === a || t === i;
}
function Hr(n, e) {
  return !ir(n, e);
}
function on(n) {
  return "year" in n && "month" in n && "day" in n;
}
function O(n) {
  return on(n) && "hour" in n && "minute" in n && "second" in n && "millisecond" in n;
}
function x(n) {
  return O(n) && "timezone" in n;
}
function Tn(n) {
  return "hour" in n && "minute" in n && "second" in n && !on(n);
}
function Y(n) {
  n = w(n, f.name);
  const e = G(n.era, n.year);
  return he(
    e,
    n.month,
    n.day,
    n.hour,
    n.minute,
    n.second,
    n.millisecond
  );
}
function he(n, e, r, t, o, a, i) {
  const s = /* @__PURE__ */ new Date();
  return s.setUTCHours(t, o, a, i), s.setUTCFullYear(n, e - 1, r), s.getTime();
}
function v(n, e) {
  if (e === "UTC")
    return 0;
  if (n > 0 && e === cn())
    return new Date(n).getTimezoneOffset() * -60 * 1e3;
  const { year: r, month: t, day: o, hour: a, minute: i, second: s } = ye(
    n,
    e
  );
  return he(r, t, o, a, i, s, 0) - Math.floor(n / 1e3) * 1e3;
}
const Xn = /* @__PURE__ */ new Map();
function ye(n, e) {
  let r = Xn.get(e);
  r || (r = new Intl.DateTimeFormat("en-US", {
    timeZone: e,
    hour12: !1,
    era: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  }), Xn.set(e, r));
  const t = r.formatToParts(new Date(n)), o = {};
  for (const a of t)
    a.type !== "literal" && (o[a.type] = a.value);
  return {
    // Firefox returns B instead of BC... https://bugzilla.mozilla.org/show_bug.cgi?id=1752253
    year: o.era === "BC" || o.era === "B" ? -o.year + 1 : +o.year,
    month: +o.month,
    day: +o.day,
    hour: o.hour === "24" ? 0 : +o.hour,
    // bugs.chromium.org/p/chromium/issues/detail?id=1045791
    minute: +o.minute,
    second: +o.second
  };
}
const an = 864e5;
function sr(n, e) {
  const r = Y(n), t = r - v(r - an, e), o = r - v(r + an, e);
  return de(n, e, t, o);
}
function de(n, e, r, t) {
  return (r === t ? [r] : [r, t]).filter((a) => ur(n, e, a));
}
function ur(n, e, r) {
  const t = ye(r, e);
  return n.year === t.year && n.month === t.month && n.day === t.day && n.hour === t.hour && n.minute === t.minute && n.second === t.second;
}
function Q(n, e, r = "compatible") {
  let t = sn(n);
  if (e === "UTC")
    return Y(t);
  if (e === cn() && r === "compatible") {
    t = w(t, f.name);
    const m = /* @__PURE__ */ new Date(), c = G(t.era, t.year);
    return m.setFullYear(c, t.month - 1, t.day), m.setHours(
      t.hour,
      t.minute,
      t.second,
      t.millisecond
    ), m.getTime();
  }
  const o = Y(t), a = v(o - an, e), i = v(o + an, e), s = de(
    t,
    e,
    o - a,
    o - i
  );
  if (s.length === 1)
    return s[0];
  if (s.length > 1)
    switch (r) {
      case "compatible":
      case "earlier":
        return s[0];
      case "later":
        return s[s.length - 1];
      case "reject":
        throw new RangeError("Multiple possible absolute times found");
    }
  switch (r) {
    case "earlier":
      return Math.min(o - a, o - i);
    case "compatible":
    case "later":
      return Math.max(o - a, o - i);
    case "reject":
      throw new RangeError("No such absolute time found");
  }
}
function b(n, e, r = "compatible") {
  return new Date(Q(n, e, r));
}
function F(n, e) {
  const r = v(n, e), t = new Date(n + r), o = t.getUTCFullYear(), a = t.getUTCMonth() + 1, i = t.getUTCDate(), s = t.getUTCHours(), m = t.getUTCMinutes(), c = t.getUTCSeconds(), y = t.getUTCMilliseconds();
  return Rn({
    year: o,
    month: a,
    day: i,
    timezone: e,
    offset: r,
    hour: s,
    minute: m,
    second: c,
    millisecond: y
  });
}
function Wr(n, e) {
  return F(n.getTime(), e);
}
function cr(n) {
  return h({
    calendar: n.calendar,
    era: n.era,
    year: n.year,
    month: n.month,
    day: n.day
  });
}
function sn(n, e) {
  let r = 0, t = 0, o = 0, a = 0;
  if ("timezone" in n)
    ({ hour: r, minute: t, second: o, millisecond: a } = n);
  else if ("hour" in n && !e)
    return n;
  return e && ({ hour: r, minute: t, second: o, millisecond: a } = e), Yn({
    calendar: n.calendar,
    era: n.era,
    year: n.year,
    month: n.month,
    day: n.day,
    hour: r,
    minute: t,
    second: o,
    millisecond: a
  });
}
function Pr(n) {
  return Ie({
    hour: n.hour,
    minute: n.minute,
    second: n.second,
    millisecond: n.millisecond
  });
}
function w(n, e) {
  if (n.calendar === e)
    return n;
  const r = u[e].fromJulianDay(
    u[n.calendar].toJulianDay(n)
  );
  return {
    ...ln({
      ...n,
      calendar: e,
      era: r.era,
      year: r.year,
      month: r.month,
      day: r.day
    })
  };
}
function br(n, e, r) {
  if ("timezone" in n)
    return n.timezone === e ? n : pn(n, e);
  const t = Q(n, e, r);
  return F(t, e);
}
function lr(n) {
  const e = Y(n) - n.offset;
  return new Date(e);
}
function pn(n, e) {
  const r = Y(n) - n.offset;
  return w(F(r, e), n.calendar);
}
function Kr(n) {
  return pn(n, cn());
}
function $(n, e) {
  var s, m;
  if (x(n))
    return Me(n, e);
  let r = { ...n };
  const { days: t, time: o } = O(r) ? yr(r, e) : { days: 0, time: {} };
  r = { ...r, ...o }, r = An(r, e.years || 0), u[r.calendar].balanceYearMonth && (r = u[r.calendar].balanceYearMonth(
    r,
    n
  )), r = {
    ...r,
    month: r.month + (e.months || 0)
  }, r = { ...r, ...wn(r) }, r = { ...r, ...ge(r) }, r = {
    ...r,
    day: r.day + (e.weeks || 0) * 7 + (e.days || 0) + t
  }, r = { ...mr(r) }, u[r.calendar].balanceDate && (r = {
    ...u[r.calendar].balanceDate(r)
  }), r.year < 1 && (r = {
    ...r,
    year: 1,
    month: 1,
    day: 1
  });
  const a = u[r.calendar].getYearsInEra(r);
  if (r.year > a) {
    const c = (m = (s = u[r.calendar]).isInverseEra) == null ? void 0 : m.call(s, r);
    r = {
      ...r,
      year: a,
      month: c ? 1 : u[r.calendar].getMonthsInYear(r),
      day: c ? 1 : u[r.calendar].getDaysInMonth(r)
    };
  }
  r.month < 1 && (r = {
    ...r,
    month: 1,
    day: 1
  });
  const i = u[r.calendar].getMonthsInYear(r);
  return r.month > i && (r = {
    ...r,
    month: i,
    day: u[r.calendar].getDaysInMonth(r)
  }), {
    ...r,
    day: Math.max(
      1,
      Math.min(
        u[r.calendar].getDaysInMonth(r),
        r.day
      )
    )
  };
}
function An(n, e) {
  var t, o;
  let r = e;
  return (o = (t = u[n.calendar]).isInverseEra) != null && o.call(t, n) && (r = -e), { ...n, year: n.year + r };
}
function wn(n) {
  let e = { ...n };
  for (; e.month < 1; ) {
    e = An(e, -1);
    const t = e.month + u[e.calendar].getMonthsInYear(e);
    e = {
      ...e,
      month: t
    };
  }
  let r = 0;
  for (; e.month > (r = u[n.calendar].getMonthsInYear(e)); ) {
    const t = e.month - r;
    e = { ...e, month: t }, e = An(e, 1);
  }
  return { ...e };
}
function mr(n) {
  let e = { ...n };
  for (; e.day < 1; )
    e = {
      ...e,
      month: e.month - 1
    }, e = wn(e), e = {
      ...e,
      day: e.day + u[e.calendar].getDaysInMonth(e)
    };
  for (; e.day > u[n.calendar].getDaysInMonth(e); )
    e = {
      ...e,
      day: e.day - u[n.calendar].getDaysInMonth(e)
    }, e = {
      ...e,
      month: e.month + 1
    }, e = wn(e);
  return e;
}
function ge(n) {
  let e = { ...n };
  return e = {
    ...e,
    month: Math.max(
      1,
      Math.min(u[n.calendar].getMonthsInYear(n), n.month)
    )
  }, {
    ...e,
    day: Math.max(
      1,
      Math.min(
        u[e.calendar].getDaysInMonth(e),
        e.day
      )
    )
  };
}
function ln(n) {
  let e = { ...n };
  return u[e.calendar].constrainDate && (e = {
    ...e,
    ...u[e.calendar].constrainDate(e)
  }), e = {
    ...e,
    year: Math.max(
      1,
      Math.min(u[e.calendar].getYearsInEra(e), e.year)
    )
  }, { ...ge(e) };
}
function De(n) {
  const e = {};
  for (const r in n)
    typeof n[r] == "number" && (e[r] = -n[r]);
  return e;
}
function Sn(n, e) {
  return x(n) ? dr(n, e) : $(n, De(e));
}
function fr(n) {
  let e = { ...n };
  return e = {
    ...e,
    second: e.second + Math.floor(e.millisecond / 1e3),
    millisecond: K(e.millisecond, 1e3)
  }, e = {
    ...e,
    minute: e.minute + Math.floor(e.second / 60),
    second: K(e.second, 60)
  }, e = {
    ...e,
    hour: e.hour + Math.floor(e.minute / 60),
    minute: K(e.minute, 60)
  }, e = {
    ...e,
    hour: K(e.hour, 24)
  }, {
    days: Math.floor(n.hour / 24),
    time: { ...n, ...e }
  };
}
function hr(n) {
  return {
    ...n,
    hour: Math.max(0, Math.min(n.hour, 23)),
    minute: Math.max(0, Math.min(n.minute, 59)),
    second: Math.max(0, Math.min(n.second, 59)),
    millisecond: Math.max(0, Math.min(n.millisecond, 1e3))
  };
}
function K(n, e) {
  let r = n % e;
  return r < 0 && (r += e), r;
}
function yr(n, e) {
  const r = {
    hour: n.hour + (e.hours || 0),
    minute: n.minute + (e.minutes || 0),
    second: n.second + (e.seconds || 0),
    millisecond: n.millisecond + (e.milliseconds || 0)
  };
  return { ...fr(r) };
}
function Me(n, e) {
  let r;
  if (e.years != null && e.years !== 0 || e.months != null && e.months !== 0 || e.weeks != null && e.weeks !== 0 || e.days != null && e.days !== 0) {
    const o = {
      ...$(sn(n), {
        years: e.years,
        months: e.months,
        weeks: e.weeks,
        days: e.days
      })
    };
    r = Q(o, n.timezone);
  } else
    r = Y(n) - n.offset;
  r += e.milliseconds || 0, r += (e.seconds || 0) * 1e3, r += (e.minutes || 0) * 60 * 1e3, r += (e.hours || 0) * 60 * 60 * 1e3;
  const t = F(r, n.timezone);
  return { ...w(t, n.calendar) };
}
function dr(n, e) {
  return { ...Me(n, De(e)) };
}
function h({
  calendar: n,
  era: e,
  year: r,
  month: t,
  day: o
}) {
  let a = {
    calendar: n ?? "gregorian",
    era: e,
    year: r,
    month: t,
    day: o
  };
  if (n === "islamic-umalqura" && En.constructCalendar(), !a.era) {
    const i = u[a.calendar].getEras();
    a = { ...a, era: i[i.length - 1] };
  }
  return { ...ln(a) };
}
function Yn({
  calendar: n,
  era: e,
  year: r,
  month: t,
  day: o,
  hour: a,
  minute: i,
  second: s,
  millisecond: m
}) {
  return {
    ...ln({
      ...h({
        calendar: n,
        era: e,
        year: r,
        month: t,
        day: o
      }),
      hour: a ?? 0,
      minute: i ?? 0,
      second: s ?? 0,
      millisecond: m ?? 0
    })
  };
}
function Rn({
  calendar: n,
  era: e,
  year: r,
  month: t,
  day: o,
  hour: a,
  minute: i,
  second: s,
  millisecond: m,
  timezone: c,
  offset: y
}) {
  return {
    ...ln({
      ...Yn({
        calendar: n,
        era: e,
        year: r,
        month: t,
        day: o,
        hour: a,
        minute: i,
        second: s,
        millisecond: m
      }),
      timezone: c,
      offset: y ?? 0
    })
  };
}
const Ie = ({
  hour: n,
  minute: e,
  second: r,
  millisecond: t
}) => ({
  ...hr({
    hour: n ?? 0,
    minute: e ?? 0,
    second: r ?? 0,
    millisecond: t ?? 0
  })
}), gr = /^(\d{2})(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Dr = /^(\d{4})-(\d{2})-(\d{2})$/, Mr = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/, Ir = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?)?\[(.*?)\]$/, Er = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/, Tr = /^((?<negative>-)|\+)?P((?<years>\d*)Y)?((?<months>\d*)M)?((?<weeks>\d*)W)?((?<days>\d*)D)?((?<time>T)((?<hours>\d*[.,]?\d{1,9})H)?((?<minutes>\d*[.,]?\d{1,9})M)?((?<seconds>\d*[.,]?\d{1,9})S)?)?$/, Ee = ["hours", "minutes", "seconds"], Ar = [
  "years",
  "months",
  "weeks",
  "days",
  ...Ee
];
function Vr(n) {
  const e = n.match(gr);
  if (!e)
    throw new Error("Invalid ISO 8601 time string: " + n);
  return Ie({
    hour: l(e[1], 0, 23),
    minute: e[2] ? l(e[2], 0, 59) : 0,
    second: e[3] ? l(e[3], 0, 59) : 0,
    millisecond: e[4] ? l(e[4], 0, 1 / 0) * 1e3 : 0
  });
}
function Zr(n) {
  const e = n.match(Dr);
  if (!e)
    throw new Error("Invalid ISO 8601 date string: " + n);
  const r = h({
    year: l(e[1], 0, 9999),
    month: l(e[2], 1, 12),
    day: 1
  });
  return {
    ...r,
    day: l(e[3], 1, u[r.calendar].getDaysInMonth(r))
  };
}
function zr(n) {
  const e = n.match(Mr);
  if (!e)
    throw new Error("Invalid ISO 8601 date time string: " + n);
  const r = Yn({
    year: l(e[1], 1, 9999),
    month: l(e[2], 1, 12),
    day: 1,
    hour: e[4] ? l(e[4], 0, 23) : 0,
    minute: e[5] ? l(e[5], 0, 59) : 0,
    second: e[6] ? l(e[6], 0, 59) : 0,
    millisecond: e[7] ? l(e[7], 0, 1 / 0) * 1e3 : 0
  });
  return {
    ...r,
    day: l(e[3], 1, u[r.calendar].getDaysInMonth(r))
  };
}
function jr(n, e) {
  const r = n.match(Ir);
  if (!r)
    throw new Error("Invalid ISO 8601 date time string: " + n);
  let t = Rn({
    year: l(r[1], 1, 9999),
    month: l(r[2], 1, 12),
    day: 1,
    timezone: r[10],
    offset: 0,
    hour: r[4] ? l(r[4], 0, 23) : 0,
    minute: r[5] ? l(r[5], 0, 59) : 0,
    second: r[6] ? l(r[6], 0, 59) : 0,
    millisecond: r[7] ? l(r[7], 0, 1 / 0) * 1e3 : 0
  });
  t = {
    ...t,
    day: l(
      r[3],
      1,
      u[t.calendar].getDaysInMonth(t)
    )
  };
  const o = sn(t);
  let a;
  if (r[8]) {
    if (t = {
      ...t,
      offset: l(r[8], -23, 23) * 60 * 60 * 1e3 + l(r[9] ?? "0", 0, 59) * 60 * 1e3
    }, a = Y(t) - t.offset, !sr(o, t.timezone).includes(a))
      throw new Error(
        `Offset ${we(t.offset)} is invalid for ${Jn(t)} in ${t.timezone}`
      );
  } else
    a = Q(
      sn(o),
      t.timezone,
      e
    );
  return F(a, t.timezone);
}
function wr(n, e) {
  const r = n.match(Er);
  if (!r)
    throw new Error("Invalid ISO 8601 date time string: " + n);
  let t = Rn({
    year: l(r[1], 1, 9999),
    month: l(r[2], 1, 12),
    day: 1,
    timezone: e,
    offset: 0,
    hour: r[4] ? l(r[4], 0, 23) : 0,
    minute: r[5] ? l(r[5], 0, 59) : 0,
    second: r[6] ? l(r[6], 0, 59) : 0,
    millisecond: r[7] ? l(r[7], 0, 1 / 0) * 1e3 : 0
  });
  const o = t.timezone;
  return t = {
    ...t,
    day: l(
      r[3],
      1,
      u[t.calendar].getDaysInMonth(t)
    )
  }, r[8] && (t = {
    ...t,
    offset: l(r[8], -23, 23) * 60 * 60 * 1e3 + l(r[9] ?? "0", 0, 59) * 60 * 1e3
  }), pn(t, o);
}
function Xr(n) {
  return wr(n, cn());
}
function l(n, e, r) {
  const t = Number(n);
  if (t < e || t > r)
    throw new RangeError(`Value out of range: ${e} <= ${t} <= ${r}`);
  return t;
}
function Te(n) {
  return `${String(n.hour).padStart(2, "0")}:${String(n.minute).padStart(2, "0")}:${String(n.second).padStart(2, "0")}${n.millisecond ? String(n.millisecond / 1e3).slice(1) : ""}`;
}
function Ae(n) {
  const e = w(n, f.name);
  return `${String(e.year).padStart(4, "0")}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}`;
}
function Jn(n) {
  return `${Ae(n)}T${Te(n)}`;
}
function nt(n) {
  return lr(n).toISOString();
}
function we(n) {
  const e = Math.sign(n) < 0 ? "-" : "+";
  n = Math.abs(n);
  const r = Math.floor(n / (60 * 60 * 1e3)), t = n % (60 * 60 * 1e3) / (60 * 1e3);
  return `${e}${String(r).padStart(2, "0")}:${String(t).padStart(2, "0")}`;
}
function Cr(n) {
  return `${Jn(n)}${we(n.offset)}[${n.timezone}]`;
}
function et(n) {
  var s, m, c, y, D, g, I, R, k;
  const e = n.match(Tr);
  if (!e)
    throw new Error(`Invalid ISO 8601 Duration string: ${n}`);
  const r = (C, J, H, pe) => {
    if (!C)
      return 0;
    try {
      return (J ? -1 : 1) * l(C.replace(",", "."), H, pe);
    } catch {
      throw new Error(`Invalid ISO 8601 Duration string: ${n}`);
    }
  }, t = !!((s = e.groups) != null && s.negative);
  if (!Ar.some(
    (C) => {
      var J;
      return (J = e.groups) == null ? void 0 : J[C];
    }
  ))
    throw new Error(`Invalid ISO 8601 Duration string: ${n}`);
  if (((m = e.groups) == null ? void 0 : m.time) && !Ee.some(
    (J) => {
      var H;
      return (H = e.groups) == null ? void 0 : H[J];
    }
  ))
    throw new Error(`Invalid ISO 8601 Duration string: ${n}`);
  const i = {
    years: r((c = e.groups) == null ? void 0 : c.years, t, 0, 9999),
    months: r((y = e.groups) == null ? void 0 : y.months, t, 0, 12),
    weeks: r((D = e.groups) == null ? void 0 : D.weeks, t, 0, 1 / 0),
    days: r((g = e.groups) == null ? void 0 : g.days, t, 0, 31),
    hours: r((I = e.groups) == null ? void 0 : I.hours, t, 0, 23),
    minutes: r((R = e.groups) == null ? void 0 : R.minutes, t, 0, 59),
    seconds: r((k = e.groups) == null ? void 0 : k.seconds, t, 0, 59)
  };
  if (i.hours !== void 0 && i.hours % 1 !== 0 && (i.minutes || i.seconds))
    throw new Error(
      `Invalid ISO 8601 Duration string: ${n} - only the smallest unit can be fractional`
    );
  if (i.minutes !== void 0 && i.minutes % 1 !== 0 && i.seconds)
    throw new Error(
      `Invalid ISO 8601 Duration string: ${n} - only the smallest unit can be fractional`
    );
  return i;
}
function rt(n) {
  return Tn(n) ? Te(n) : x(n) ? Cr(n) : O(n) ? Jn(n) : Ae(n);
}
const yn = /* @__PURE__ */ new Map();
function Ce(n, e = {}) {
  if (typeof e.hour12 == "boolean" && pr()) {
    e = { ...e };
    const o = Rr[String(e.hour12)][n.split("-")[0]], a = e.hour12 ? "h12" : "h23";
    e.hourCycle = o ?? a, delete e.hour12;
  }
  const r = n + (e ? Object.entries(e).sort((o, a) => o[0] < a[0] ? -1 : 1).join() : "");
  if (yn.has(r))
    return yn.get(r);
  const t = new Intl.DateTimeFormat(n, e);
  return yn.set(r, t), t;
}
let dn = null;
function pr() {
  return dn == null && (dn = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: !1
  }).format(new Date(2020, 2, 3, 0)) === "24"), dn;
}
let gn = null;
function Sr() {
  return gn == null && (gn = new Intl.DateTimeFormat("fr", {
    hour: "numeric",
    hour12: !1
  }).resolvedOptions().hourCycle === "h12"), gn;
}
function Yr(n, e) {
  if (!e.timeStyle && !e.hour)
    return;
  n = n.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, ""), n += (n.includes("-u-") ? "" : "-u") + "-nu-latn";
  const r = Ce(n, {
    ...e,
    timeZone: void 0
    // use local timezone
  }), t = parseInt(
    r.formatToParts(new Date(2020, 2, 3, 0)).find((a) => a.type === "hour").value,
    10
  ), o = parseInt(
    r.formatToParts(new Date(2020, 2, 3, 23)).find((a) => a.type === "hour").value,
    10
  );
  if (t === 0 && o === 23)
    return "h23";
  if (t === 24 && o === 23)
    return "h24";
  if (t === 0 && o === 11)
    return "h11";
  if (t === 12 && o === 11)
    return "h12";
  throw new Error("Unexpected hour cycle result");
}
function tt(n, e = {}) {
  const r = Ce(
    n,
    e
  );
  let t;
  function o(c) {
    return r.format(c);
  }
  function a(c) {
    return r.formatToParts(c);
  }
  function i(c, y) {
    if (typeof r.formatRange == "function")
      return r.formatRange(c, y);
    if (y < c)
      throw new RangeError("End date must be >= start date");
    return `${r.format(c)} – ${r.format(y)}`;
  }
  function s(c, y) {
    if (typeof r.formatRangeToParts == "function")
      return r.formatRangeToParts(c, y);
    if (y < c)
      throw new RangeError("End date must be >= start date");
    const D = r.formatToParts(c), g = r.formatToParts(y);
    return [
      ...D.map(
        (I) => ({ ...I, source: "startRange" })
      ),
      { type: "literal", value: " – ", source: "shared" },
      ...g.map(
        (I) => ({ ...I, source: "endRange" })
      )
    ];
  }
  function m() {
    const c = r.resolvedOptions();
    return Sr() && (t || (t = Yr(
      c.locale,
      e
    )), c.hourCycle = t, c.hour12 = t === "h11" || t === "h12"), c.calendar === "ethiopic-amete-alem" && (c.calendar = "ethioaa"), c;
  }
  return {
    formatter: r,
    format: o,
    formatToParts: a,
    formatRange: i,
    formatRangeToParts: s,
    resolvedOptions: m
  };
}
const Rr = {
  true: {
    // Only Japanese uses the h11 style for 12 hour time. All others use h12.
    ja: "h11"
  },
  false: {
    // All locales use h23 for 24 hour time. None use h24.
  }
};
export {
  Bn as BuddhistCalendar,
  $n as CopticCalendar,
  tt as DateFormatter,
  Fn as EthiopicAmeteAlemCalendar,
  j as EthiopicCalendar,
  f as GregorianCalendar,
  On as HebrewCalendar,
  _n as IndianCalendar,
  E as IslamicCivilCalendar,
  Nn as IslamicTabularCalendar,
  En as IslamicUmalquraCalendar,
  Pn as JapaneseCalendar,
  bn as PersianCalendar,
  Zn as TaiwanCalendar,
  h as createCalendarDate,
  Yn as createCalendarDateTime,
  Ie as createTime,
  Rn as createZonedDateTime,
  rr as endOfMonth,
  Nr as endOfWeek,
  $r as endOfYear,
  F as fromAbsolute,
  Wr as fromDate,
  le as getDayOfWeek,
  Fr as getHoursInDay,
  cn as getLocalTimeZone,
  qr as getMinimumDayInMonth,
  kr as getMinimumMonthInYear,
  xr as getWeeksInMonth,
  Or as isEqualDay,
  Lr as isEqualMonth,
  _r as isEqualYear,
  ze as isSameDay,
  Br as isSameMonth,
  Ur as isSameYear,
  Qr as isToday,
  Hr as isWeekday,
  ir as isWeekend,
  Gr as maxDate,
  vr as minDate,
  je as now,
  wr as parseAbsolute,
  Xr as parseAbsoluteToLocal,
  Zr as parseDate,
  zr as parseDateTime,
  et as parseDuration,
  Vr as parseTime,
  jr as parseZonedDateTime,
  _ as startOfMonth,
  tr as startOfWeek,
  tn as startOfYear,
  rt as temporalToString,
  nt as toAbsoluteString,
  w as toCalendar,
  cr as toCalendarDate,
  sn as toCalendarDateTime,
  Kr as toLocalTimeZone,
  Pr as toTime,
  pn as toTimeZone,
  br as toZoned,
  Xe as today
};
