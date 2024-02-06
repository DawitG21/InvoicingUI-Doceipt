import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IBroadcast } from '../interfaces/ibroadcast';

@Injectable({
  providedIn: 'root'
})

export class BroadcastService implements IBroadcast {

  subject = new Subject<any>();

  constructor (
  ) { }

  broadcastTask(message: any): void {
    this.subject.next(message);
  }

  subscribeTask(): Observable<any> {
    return this.subject.asObservable();
  }

}
