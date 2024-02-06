import { Pipe, PipeTransform } from '@angular/core';

/*
 * Group an array by a property (key)
 * Usage:
 *  value | filterUnique : 'field.field'
 */

@Pipe({ name: 'filterUnique' })
export class FilterUniquePipe implements PipeTransform {
  transform(value: any, field: string): any {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!value) {
      return null;
    }
    const f = field.split('.');
    // Remove the duplicate elements
    var art = this.getValue(value, f, f[this.counter]);
    art.reduce((acc: any, ele: any, i: any) => {
      acc = acc.concat(ele);
      return acc;
    });
    return new Set(art);
  }

  counter = 0;
  getValue(value: any, fields: string[], field: any): any {
      // console.log('piping', v, field, this.counter, fields.length, Array.isArray(v));

    if (this.counter < fields.length) {
      this.counter++;
      if (Array.isArray(value)) {
        return value.map(x => {
          return this.getValue(x[field], fields, fields[this.counter]);
        });
      } else {
        return this.getValue(value[field], fields, fields[this.counter])
      }
    }

    // go back to previous pointer
    this.counter--;
    return value;
  }

}
