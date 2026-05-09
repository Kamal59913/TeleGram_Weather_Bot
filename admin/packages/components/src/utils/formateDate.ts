export type DateFormat =
  | "date"          // "Apr 17, 2025"
  | "time"          // "10:16 AM"
  | "datetime"      // "Apr 17, 2025, 10:16 AM"
  | "iso"           // "2025-04-17"
  | "full"          // "Thursday, April 17, 2025, 10:16 AM"
  | "custom";       // use with customFormat option

interface FormatDateOptions {
  format?: DateFormat;
  locale?: string;
  customFormat?: Intl.DateTimeFormatOptions;
  timeZone?: string;
}

export function formatDate(
  dateInput: string | Date,
  options: FormatDateOptions = {}
): string {
  const {
    format = "datetime",
    locale = "en-US",
    customFormat,
    timeZone = "UTC",
  } = options;

  const date = new Date(dateInput);

  const formatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    date: { year: "numeric", month: "short", day: "numeric", timeZone },
    time: { hour: "numeric", minute: "numeric", timeZone },
    datetime: { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", timeZone },
    iso: {}, // special case
    full: { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", timeZone },
    custom: customFormat || {}, // fallback to empty if not provided
  };

  if (format === "iso") {
    return date.toISOString().split("T")[0];
  }

  const formatter = new Intl.DateTimeFormat(locale, formatOptions[format]);
  return formatter.format(date) ;
}
