import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

/**
 * Indian Standard Time (IST) timezone constant
 */
export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Get current date/time in IST timezone
 * @returns Date object representing current time in IST
 */
export function getCurrentISTTime(): Date {
  return toZonedTime(new Date(), IST_TIMEZONE);
}

/**
 * Format a date in IST timezone with a specific format
 * @param date - Date to format
 * @param formatString - Format string (e.g., 'yyyy-MM-dd HH:mm:ss')
 * @returns Formatted date string in IST
 */
export function formatInIST(
  date: Date | string | number,
  formatString: string = 'yyyy-MM-dd HH:mm:ss',
): string {
  return formatInTimeZone(date, IST_TIMEZONE, formatString);
}

/**
 * Get ISO string with IST timezone offset
 * @param date - Date to convert (defaults to current time)
 * @returns ISO 8601 string with IST offset (e.g., '2025-11-26T12:00:00+05:30')
 */
export function getISTISOString(
  date: Date | string | number = new Date(),
): string {
  return formatInTimeZone(date, IST_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

/**
 * Convert any date to IST timezone
 * @param date - Date to convert
 * @returns Date object in IST timezone
 */
export function toIST(date: Date | string | number): Date {
  return toZonedTime(date, IST_TIMEZONE);
}

/**
 * Get current timestamp in milliseconds (timezone-independent)
 * @returns Milliseconds since epoch
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * Get date string for display (YYYY-MM-DD in IST)
 * @returns Date string in IST
 */
export function getISTDateString(): string {
  return formatInIST(new Date(), 'yyyy-MM-dd');
}

/**
 * Get full timestamp string for display (YYYY-MM-DD HH:mm:ss in IST)
 * @returns Timestamp string in IST
 */
export function getISTTimestamp(): string {
  return formatInIST(new Date(), 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Format timestamp for display with time ago format
 * @param timestamp - ISO string or Date object
 * @returns Formatted string in IST timezone
 */
export function formatTimestampForDisplay(timestamp: string | Date): string {
  return formatInIST(timestamp, 'MMM dd, yyyy h:mm a');
}

/**
 * Calculate remaining time until a specific timestamp
 * @param futureTimestamp - Future timestamp in milliseconds
 * @returns Remaining time in milliseconds
 */
export function getTimeRemaining(futureTimestamp: number): number {
  return futureTimestamp - getCurrentTimestamp();
}

/**
 * Check if a timestamp is in the past (IST timezone aware)
 * @param timestamp - Timestamp to check
 * @returns true if the timestamp is in the past
 */
export function isInPast(timestamp: number): boolean {
  return timestamp <= getCurrentTimestamp();
}

/**
 * Add hours to current IST time and return timestamp
 * @param hours - Number of hours to add
 * @returns Timestamp in milliseconds
 */
export function addHoursToNow(hours: number): number {
  return getCurrentTimestamp() + hours * 60 * 60 * 1000;
}
