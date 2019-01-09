import { Observable, of, throwError, pipe } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Gizmo } from './data.models';
import { Gizmos } from './fake.data';

// Simulated API - read from fake data and pause for 2 seconds
export class FakeApi {

    // Get all gizmos
    getAllGizmos(): Observable<Gizmo[]> {
        const all = [...Gizmos];
        return of(all).pipe(delay(2000));
    }

    // Get a single gizmo - if the ID not in the fake data, throw an error
    getOneGizmo(id: number): Observable<Gizmo> {
        const all = [...Gizmos];
        const gizmo = all.find(x => x.id === id);
        if (gizmo) {
            return of(gizmo).pipe(delay(2000));
        } else {
            return throwError(new Error('Not Found'));
        }
    }

    // Update an entity
    put<T>(data: T): Observable<any> {
        return of(null).pipe(delay(2000));
    }
}
