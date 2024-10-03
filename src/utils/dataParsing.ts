import momentTz from 'moment-timezone';

// eslint-disable-next-line prefer-const
let browserTz: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

interface CommonDataParsing {
  parseJSDateHuman: (date: string | Date, notSeconds?: boolean) => string;
  parseDate: (dateInMs: number) => string;
  trimDescription: (description: string | null, length?: number) => string | null;
  trimTitle: (title: string, length?: number) => string;
  toTitleCase: (str: string | null) => string | null;
  parseGuestJob: (str: string | null) => string | null;
}

export const commonDataParsing: CommonDataParsing = {
  parseJSDateHuman: (date, notSeconds) => {
    const newDate = new Date(date);
    const format = notSeconds ? 'MM/DD/YYYY' : 'MM/DD/YYYY - hh:mm a';
    const momentDate = momentTz(newDate);
    return momentDate.tz(browserTz).format(format);
  },

  parseDate: (dateInMs) => {
    const d: Date = new Date(dateInMs);
    const momentDate = momentTz(d);
    return momentDate.tz(browserTz).format('MM/DD/YYYY');
  },

  trimDescription: (description: string | null, length = 350): string | null => {
    return description && description.length > length
      ? `${description.substring(0, length)}...`
      : description;
  },

  trimTitle: (title: string, length = 70): string => {
    return title && title.length > length ? `${title.substring(0, length)}...` : title;
  },

  toTitleCase: (str: string | null): string | null => {
    return str
      ? str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
      : str;
  },

  parseGuestJob: (str: string | null): string | null => {
    return str && str.includes(' at ') ? str.split(' at ')[0] : str;
  },
};
