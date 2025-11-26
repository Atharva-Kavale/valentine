import { Pipe, PipeTransform } from '@angular/core';
import { formatTimestampForDisplay } from '../utils/timezone.util';

@Pipe({
  name: 'istDate',
  standalone: true,
})
export class IstDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    try {
      return formatTimestampForDisplay(value);
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(value);
    }
  }
}
