import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  constructor() { }

  consoleMessage(message: any) {
    if (!environment.production) {
      console.log(message);
    }
  }
}
