// backfill.mjs — Insert needs-assessment records from email data

const API_URL = "https://tccdiscovery.vercel.app/api/submit";

function makeRecord(overrides) {
  return {
    sp: "",
    cn: "",
    stk: "",
    vy: "",
    vm: "",
    vmod: "",
    mot: "",
    hasTrade: false,
    tv: "",
    tlike: "",
    tdis: "",
    tlen: "",
    tbal: "",
    tpay: "",
    rv: "",
    rl: "",
    rd: "",
    life: [],
    hot: [],
    pd: "",
    di: "",
    mh: "",
    nn: "",
    dur: 0,
    ts: "",
    lang: "en",
    ...overrides,
  };
}

const records = [
  // 1
  makeRecord({
    cn: "Taryn Mitchell",
    sp: "Damian Flores",
    ts: "2026-04-19T19:46:29Z",
    vy: "2026",
    vm: "TOYOTA",
    vmod: "HIGHLANDER / GRANDHIGHLANDER",
  }),
  // 2
  makeRecord({
    cn: "His barrionvo",
    sp: "D'Marcus Anthony",
    ts: "2026-04-19T19:01:20Z",
    vm: "Toyota",
    vmod: "Highlander",
  }),
  // 3
  makeRecord({
    cn: "micheal",
    sp: "Will Thermidor",
    ts: "2026-04-19T17:38:43Z",
    mot: "looking for cheap reliabe daily",
    hasTrade: true,
    tv: "2003 escalade",
  }),
  // 4
  makeRecord({
    cn: "Crisanto medrano",
    sp: "D'Marcus Anthony",
    ts: "2026-04-19T17:00:24Z",
    vy: "2026",
    vm: "Toyota",
    vmod: "Cross",
  }),
  // 5
  makeRecord({
    cn: "CHUCK",
    sp: "Damian Flores",
    ts: "2026-04-19T16:43:45Z",
    hasTrade: true,
    tv: "2019 CHRYSLER SUPER SPORT",
    tlike: "IT HAS ROOM, ITS FAST",
  }),
  // 6
  makeRecord({
    cn: "CHRISTOPHER PAULEY",
    sp: "Damian Flores",
    ts: "2026-04-19T16:01:10Z",
    vy: "2026",
    vm: "TOYOTA",
    vmod: "CAMRY",
    hasTrade: true,
  }),
  // 7
  makeRecord({
    cn: "luvenson",
    sp: "Will Thermidor",
    ts: "2026-04-18T23:22:01Z",
    vy: "2023",
    vm: "toyota",
    vmod: "highlander",
    mot: "looking at",
  }),
  // 8
  makeRecord({
    cn: "KELLY D SATTERFIELD",
    sp: "Damian Flores",
    ts: "2026-04-18T22:36:54Z",
    vm: "TOYOTA",
    vmod: "HIGHLANDER",
    mot: "WANTS",
  }),
  // 9
  makeRecord({
    cn: "Patricia Wagoner",
    sp: "Cody Thompson",
    ts: "2026-04-18T21:47:13Z",
    vy: "2026",
    vm: "Toyota",
    vmod: "4Runner",
    mot: "Needing",
  }),
  // 10
  makeRecord({
    cn: "Emily zendalya",
    sp: "Nick Plank",
    ts: "2026-04-18T20:06:11Z",
    vy: "2026",
    vm: "Toyota",
    vmod: "Camry",
    mot: "Needs a car",
  }),
  // 11
  makeRecord({
    cn: "Michelle L Davis",
    sp: "Charles Leigh",
    ts: "2026-04-18T19:54:29Z",
    stk: "TC000663",
    vy: "2026",
    vm: "Toyota",
    vmod: "Rav4",
  }),
  // 12
  makeRecord({
    cn: "Bella",
    sp: "Jeff Princile",
    ts: "2026-04-18T19:35:13Z",
    vy: "2017",
    vm: "Toyota",
    vmod: "Tacoma",
    mot: "Need a new vehicle",
  }),
  // 13
  makeRecord({
    cn: "Michael Walters",
    sp: "Christian Odio",
    ts: "2026-04-18T19:18:56Z",
    vy: "2019",
    vm: "Ford",
    vmod: "f-150",
    mot: "Truck for",
  }),
  // 14
  makeRecord({
    cn: "Wendell and Michele",
    sp: "Charles Leigh",
    ts: "2026-04-18T18:53:21Z",
    stk: "TC000663",
    vy: "2026",
    vm: "Toyota",
    vmod: "Rav4",
  }),
  // 15
  makeRecord({
    cn: "AARON BOARD",
    sp: "Miguel Medina",
    ts: "2026-04-18T18:22:02Z",
    stk: "T8077903A",
    vy: "2022",
    vm: "Toyota",
    vmod: "Tacoma",
  }),
  // 16
  makeRecord({
    cn: "Silas johnson",
    sp: "",
    ts: "2026-04-18T18:18:21Z",
    vm: "Toyota",
    vmod: "Tacoma",
    mot: "Looking at the tacoma",
  }),
  // 17
  makeRecord({
    cn: "Arnold patricia",
    sp: "Alain Pino",
    ts: "2026-04-18T18:09:49Z",
    vy: "2026",
    vm: "Toyota",
    vmod: "Rav4",
    mot: "Rav4",
    hasTrade: true,
  }),
  // 18
  makeRecord({
    cn: "Bud Dennis",
    sp: "Matt Smith",
    ts: "2026-04-18T17:05:36Z",
    stk: "Corolla cross",
    mot: "Small SUV",
    hasTrade: true,
  }),
  // 19
  makeRecord({
    cn: "Carlton Dean Fay",
    sp: "Damian Flores",
    ts: "2026-04-18T16:59:49Z",
    vm: "Toyota",
    vmod: "CH-R",
    mot: "THEY LIKE",
  }),
  // 20
  makeRecord({
    cn: "Terri Madalinski",
    sp: "Christian Odio",
    ts: "2026-04-18T16:51:03Z",
    vy: "2026",
    vm: "Toyota",
    vmod: "Highlander",
  }),
  // 21
  makeRecord({
    cn: "Marc",
    sp: "Cody Thompson",
    ts: "2026-04-18T15:32:34Z",
    vy: "2025",
    vm: "Toyota",
    vmod: "Rav 4",
    mot: "Needs to add car to",
  }),
  // 22
  makeRecord({
    cn: "tahir",
    sp: "Will Thermidor",
    ts: "2026-04-18T15:28:21Z",
    stk: "mercedes",
    mot: "they came from miami",
  }),
  // 23
  makeRecord({
    cn: "Miguel Cordova",
    sp: "Miguel Medina",
    ts: "2026-04-18T15:27:49Z",
    mot: "Has a 2025 accord he put 1k dowm but is looking for used",
  }),
  // 24
  makeRecord({
    cn: "Gina and Frank",
    sp: "Alain Pino",
    ts: "2026-04-18T14:48:28Z",
    vy: "2026",
    vm: "Toyota",
    vmod: "Rav4",
    mot: "Plugnin hybrid",
  }),
  // 25
  makeRecord({
    cn: "Felix paulino",
    sp: "D'Marcus Anthony",
    ts: "2026-04-18T13:40:48Z",
    vy: "2026",
    vm: "Toyota",
    vmod: "Camry",
  }),
  // 26
  makeRecord({
    cn: "Customer",
    sp: "Kelly Floyd",
    ts: "2026-04-18T13:28:12Z",
    stk: "Ts0421149A",
    vy: "2025",
    vm: "Chevy",
    vmod: "Blazer",
    mot: "adding vehicle for",
  }),
  // 27
  makeRecord({
    cn: "RAFAEL MIRABAL",
    sp: "Damian Flores",
    ts: "2026-04-17T21:02:57Z",
    vy: "2026",
    vm: "TOYOTA",
    vmod: "RAV4",
    mot: "HE SAW IN",
  }),
  // 28
  makeRecord({
    cn: "Yonardy",
    sp: "Miguel Medina",
    ts: "2026-04-17T20:28:06Z",
    stk: "4runner",
    vy: "2026",
    vm: "Toyota",
    vmod: "4runner limited",
  }),
  // 29
  makeRecord({
    cn: "Roynel Lara Santana",
    sp: "Christian Odio",
    ts: "2026-04-17T20:04:22Z",
    vy: "2016",
    vm: "Chrysler",
    vmod: "Town",
    mot: "Is",
  }),
  // 30
  makeRecord({
    cn: "JAMIL",
    sp: "Damian Flores",
    ts: "2026-04-17T19:33:22Z",
    vy: "2026",
    vm: "TOYOTA",
    vmod: "SIENNA",
    mot: "MAILER",
    hasTrade: true,
  }),
  // 31
  makeRecord({
    cn: "david",
    sp: "Will Thermidor",
    ts: "2026-04-17T18:23:11Z",
    stk: "sienna",
    mot: "was recommended to look at the",
  }),
  // 32
  makeRecord({
    cn: "Moises",
    sp: "Jeff Princile",
    ts: "2026-04-17T17:21:32Z",
    mot: "4 year lease and need another vehicle and bigger 24000, paying",
  }),
  // 33
  makeRecord({
    cn: "Yadiel",
    sp: "",
    ts: "2026-04-17T16:38:20Z",
    mot: "Wants to get cobuyer off and lower his payments from 650",
    hasTrade: true,
    tv: "2024 Chevy",
  }),
  // Records 34-38 already exist in tccdiscovery DB — skipped
];

async function submitRecord(record, index) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (res.ok) {
      console.log(`[${index + 1}] OK — ${record.cn} / ${record.sp}`);
      return true;
    } else {
      console.error(`[${index + 1}] FAIL (${res.status}) — ${record.cn} / ${record.sp}: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (err) {
    console.error(`[${index + 1}] ERROR — ${record.cn} / ${record.sp}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`Submitting ${records.length} records to ${API_URL}\n`);

  let success = 0;
  let fail = 0;

  // Submit sequentially to avoid rate limits
  for (let i = 0; i < records.length; i++) {
    const ok = await submitRecord(records[i], i);
    if (ok) success++;
    else fail++;
    // Small delay between requests
    if (i < records.length - 1) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log(`\nDone: ${success} succeeded, ${fail} failed out of ${records.length} total.`);
}

main();
