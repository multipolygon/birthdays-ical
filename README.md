# Generate an iCal ics file for a list of birth dates

For importing to standard calendar apps like iPhone, Android and Outlook.

Calendar includes:

- Annual birthdays with pre-calculated age (eg `"Bob's 21st Birthday"`, `"Alice's 70th Birthday"`)
- Identifies significant years (eg 21st, 70th)
- Typical month-milestones for babies
- Round-number days and hours (eg `"Bob's 10000th day!`")
- Birthdays in Martian-years

Example input file `birthdays.yaml`:

    Alice: 1952-03-28
    Bob: 1975-08-03

https://www.npmjs.com/package/ics
