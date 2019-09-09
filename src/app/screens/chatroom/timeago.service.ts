/**
 * Enhances formatting of sent messages to print elapsed time
 * in lieu of exact time/date.
 */

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(date: Date, args: any[]) {
    return moment(date).fromNow();
  }
}
