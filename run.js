import YAML from "yaml";
import fs from "fs";
import _ from "lodash";
import { DateTime, Interval } from "luxon";
import ics from "ics";

const birthdays = _.mapValues(
  YAML.parse(fs.readFileSync("birthdays.yaml").toString()),
  (v) => DateTime.fromISO(v)
);

console.log(birthdays);

const toYMD = (dt) => [dt.get("year"), dt.get("month"), dt.get("day")];

const toEvent = (title, dt) => ({
  title,
  start: toYMD(dt),
  end: toYMD(dt.plus({ day: 1 })),
});

const nth = (n) =>
  n + (["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th");

const specials = [1, 18, 21, 30, 40, 70, 100];

const special = (n) => (specials.includes(n) ? "!!!" : "");

const events = [];

const MARTIAN_YEAR = 687;

Object.entries(birthdays).forEach(([name, dt]) => {
  events.push(toEvent(`${name}'s Birthday`, dt));

  _.range(0, 10).forEach((y) => {
    const dt2 = dt.set({ year: DateTime.now().get("year") + y });
    const interval = Interval.fromDateTimes(dt, dt2);
    events.push(
      toEvent(
        `${name}'s ${nth(interval.length("year"))} Birthday` +
          special(interval.length("year")),
        dt2
      )
    );
  });

  [500, 1000, 5000, 10000, 20000].forEach((d) => {
    const dt2 = dt.plus({ days: d });
    if (dt2 >= DateTime.now() && dt2 <= dt.plus({ years: 100 })) {
      events.push(toEvent(`${name}'s ${nth(d)} Day!!!`, dt2));
    }
  });

  [10000, 100000, 500000].forEach((h) => {
    const dt2 = dt.plus({ hours: h });
    if (dt2 >= DateTime.now() && dt2 <= dt.plus({ years: 100 })) {
      events.push(toEvent(`${name}'s ${nth(h)} Hour!!!`, dt2));
    }
  });

  [1, 10, 20, 40, 50].forEach((y) => {
    const dt2 = dt.plus({ days: y * MARTIAN_YEAR });
    if (dt2 >= DateTime.now() && dt2 <= dt.plus({ years: 100 })) {
      events.push(toEvent(`${name}'s ${nth(y)} Martian Birthday!!!`, dt2));
    }
  });
});

ics.createEvents(_.sortBy(_.uniq(events), "start"), (err, value) =>
  fs.writeFileSync("birthdays.ics", value)
);
