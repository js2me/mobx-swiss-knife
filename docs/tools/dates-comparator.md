# `DatesComparator`

`DatesComparator` stores countdown state. Pass two dates and use the ready-made `hours`, `minutes`, and `seconds` values in the UI. The special value `"now"` updates the comparison automatically, so a separate `setInterval` is not needed for the countdown.

## Example: Invitation Expiration

```ts
import { createDatesComparator } from "mobx-swiss-knife";

const invitation = createDatesComparator({
  dates: ['now', new Date('2026-12-31T23:59:59.000Z')],
  checkTime: 1000,
});

const label = () =>
  invitation.isEmpty
    ? 'Expiration is not set'
    : `${invitation.hours} h ${invitation.minutes} min ${invitation.seconds} s`;

console.log(label());

// Changing the deadline does not require creating a new object.
invitation.setDates(['now', new Date('2027-01-01T12:00:00.000Z')]);

invitation.reset();
console.log(invitation.isEmpty); // true
```

## Creation

```ts
createDatesComparator({
  dates: [startDate, endDate],
  checkTime: 100, // defaults to 100 ms
});
```

`startDate` and `endDate` can be `Date`, a timestamp in milliseconds, or `"now"`. The difference is always calculated as the duration between the start and end; UIs with a dynamic start typically use `['now', deadline]`.

## Properties

| Property | Purpose |
| --- | --- |
| `dates` | The current pair of dates or `null`. |
| `hours`, `minutes`, `seconds` | Difference components for display. |
| `totalHours`, `totalMinutes`, `totalSeconds` | The same difference without splitting into components. |
| `isEmpty` | `true` when the comparison has not been set or has been reset. |

## Methods

- `setDates([start, end])` — replace the interval and recalculate values.
- `reset()` — clear the interval; afterward, `isEmpty === true`.

## Additional Options

- `checkTime` — the frequency for checking a dynamic date in milliseconds.
- `getComparison(startDate, endDate)` — custom calculation of `{ hours, minutes, seconds }` when the standard display is insufficient.
- `abortSignal` — bind the lifecycle to a component or model.
