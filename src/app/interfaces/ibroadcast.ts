import { Observable } from 'rxjs';

export interface IBroadcast {
    subscribeTask(): Observable<any>;
    broadcastTask(message: any): void;
}
