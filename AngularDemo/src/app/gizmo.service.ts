import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Banjo } from './banjo';
import { Gizmo } from './data.models';
import { FakeApi } from './fake.api';

@Injectable()
export class GizmoService {

    private cacheId = 'gizmos';
    private gotGizmos = false;

    constructor(private cache: Banjo, private fakeApi: FakeApi) {

        // Initialize the cache
        cache.initEntry<Gizmo[]>(this.cacheId, []);
    }

    // Exposes an observable to listen for updates
    gizmos$(): Observable<Gizmo[]> {
        return this.cache.stream<Gizmo[]>(this.cacheId);
    }

    // Get all gizmos
    getAllGizmos(): Observable<any> {

        // If cached, return from the cache
        if (this.gotGizmos) {
            this.cache.publish(this.cacheId);
            return of(null);
        }

        // Otherwise make an API call and update the cache
        // Set automatically publishes the cache
        return this.fakeApi.getAllGizmos().pipe(map(gizmos => {
            this.gotGizmos = true;
            this.cache.set(this.cacheId, gizmos);
        }));
    }

    // Get a single gizmo by ID
    getGizmo(id: number): Observable<any> {

        // If cached, return from the cache
        const selectedGizmo = this.cache.get<Gizmo[]>(this.cacheId).find(gizmo => gizmo.id === id);
        if (selectedGizmo) {
            this.cache.publish(this.cacheId);
            return of(null);
        }

        // Otherwise make an API call and update the cache
        // Merge automatically publishes the cache
        return this.fakeApi.getOneGizmo(id).pipe(map(gizmo => this.cache.merge(this.cacheId, [gizmo], 'id')));
    }

    updateGizmo(gizmo: Gizmo): Observable<any> {

        // PUT to the API and update the cache if successful
        // Merge automatically publishes the cache
        return this.fakeApi.put<Gizmo>(gizmo).pipe(map(x => this.cache.merge(this.cacheId, [gizmo], 'id')));
    }

    // Reset the cache to empty
    clearCacheForDemo() {
        this.cache.set(this.cacheId, []);
        this.gotGizmos = false;
    }
}
