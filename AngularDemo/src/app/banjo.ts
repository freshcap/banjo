import { BehaviorSubject } from 'rxjs';

// Data cache wrapper class
export class Banjo {

    private entries: any[] = [];

    // Add an initial data cache entry (should be called from the service's constructor.)
    public initEntry<T>(cacheId: string, initialValue: T = null): void {
        let entry = <CacheEntry<T>>this.getEntry(cacheId);
        if (!entry) {
            entry = new CacheEntry<T>(cacheId);
            this.entries.push(entry);
        }
        entry.initialize(initialValue);
    }

    // Set the data for a cache entry
    public set<T>(cacheId: string, data: T): void {
        if (!this.getEntry(cacheId)) {
            throw new Error('Cache entry not found: ' + cacheId);
        }

        const entry = this.getEntry<T>(cacheId);
        entry.set(data);
    }

    // Get the data for a cache entry
    public get<T>(cacheId: string): T {
        const entry = this.getEntry<T>(cacheId);
        if (!entry) {
            throw new Error('Cache entry not found: ' + cacheId);
        }

        return entry.get();
    }

    // Get the Observable stream for a cache entry
    public stream<T>(cacheId: string): BehaviorSubject<T> {
        const entry = this.getEntry<T>(cacheId);
        if (!entry) {
            throw new Error('Cache entry not found: ' + cacheId);
        }

        return entry.stream$;
    }

    // Remove all cache entries
    public resetAll(): void {
        this.entries = [];
    }

    // Trigger the Observable stream for the cache entry
    public publish(cacheId: string): void {
        const entry = this.getEntry(cacheId);
        if (!entry) {
            throw new Error('Cache entry not found: ' + cacheId);
        }
        entry.publish();
    }

    private getEntry<T>(cacheId: string): CacheEntry<T> {
        return <CacheEntry<T>>this.entries.find(x => x.id === cacheId);
    }

    // -------------------------------------------------------------------------------------------------
    // Array Methods
    // -------------------------------------------------------------------------------------------------

    // Append an array of items to the cache array
    append<T>(cacheId: string, data: T[]): void {
        const entry = this.getEntry(cacheId);
        if (!entry) {
            throw new Error('Cache entry not found: ' + cacheId);
        }

        let cacheData = this.get<T[]>(cacheId);
        if (cacheData == null) {
            cacheData = [];
        }

        entry.set(cacheData.concat(data));

        this.publish(cacheId);
    }

    // Append an array of items to the cache array - overwrite any items with the existing ID
    public merge<T>(cacheId: string, data: T[], dataIdPropertyName: string): void {
        const entry = this.getEntry<T[]>(cacheId);
        if (!entry) {
            throw new Error('Cache entry not found: ' + cacheId);
        }

        const cacheData = this.get<T[]>(cacheId);

        // If the cache entry is null, just set it and return
        if (cacheData === null) {
            entry.set(data);
            return;
        }

        // For each passed in entity
        for (let i = 0; i < data.length; i++) {

            // If it already exists in the cache, remove it
            const index = cacheData.findIndex(x => x[dataIdPropertyName] === data[i][dataIdPropertyName]);
            if (index >= 0) {
                cacheData.splice(index, 1);
            }

            // Add the entity
            cacheData.push(data[i]);
        }

        this.publish(cacheId);
    }

    // Append an array of items to the cache array - overwrite any items with the existing expression
    public mergeFor<T>(cacheId: string, data: T[], where: (item: T) => boolean): void {
        const entry = this.getEntry<T[]>(cacheId);
        if (!entry) {
            throw new Error('Cache entry not found: ' + cacheId);
        }

        const cacheData = this.get<any[]>(cacheId);
        if (!cacheData) {
            return;
        }

        // Remove anything matching the find expression
        const remove = cacheData.filter(x => where(x));
        remove.forEach(item => {
            const index = cacheData.indexOf(item);
            cacheData.splice(index, 1);
        });

        // Add in new data
        entry.set(cacheData.concat(data));

        this.publish(cacheId);
    }

    // Remove all items with the specified ID value
    public remove(cacheId: string, dataIdValue: any, dataIdPropertyName: string) {
        const entry = this.getEntry(cacheId);
        if (!entry) {
            throw new Error('Cache entry not found: ' + cacheId);
        }

        const cacheData = this.get<any[]>(cacheId);
        if (!cacheData) {
            return;
        }

        const index = cacheData.findIndex(x => x[dataIdPropertyName] === dataIdValue);
        if (index >= 0) {
            cacheData.splice(index, 1);
            this.publish(cacheId);
        }
    }

    // Remove all items with the specified expression
    public removeFor<T>(cacheId: string, where: (item: T) => boolean) {
        const entry = this.getEntry(cacheId);
        if (!entry) {
            throw new Error('Cache entry not found: ' + cacheId);
        }

        const cacheData = this.get<T[]>(cacheId);
        if (!cacheData) {
            return;
        }

        const index = cacheData.findIndex(x => where(x));
        if (index >= 0) {
            cacheData.splice(index, 1);
            this.publish(cacheId);
        }
    }
}

// Entry object for the data cache
class CacheEntry<T> {
    id: string;

    private observable$: BehaviorSubject<T>;
    private initialValue: T;
    private data: T;
    private initialized = false;

    // Pass the ID for the entry type
    constructor(id: string) {
        this.id = id;
    }

    // Set an initial empty value and create the Observable stream
    initialize(initialValue: T = null) {
        if (!this.initialized) {
            this.initialValue = initialValue;
            this.data = this.initialValue;
            this.observable$ = new BehaviorSubject<T>(this.initialValue);
            this.initialized = true;
        }
    }

    public get stream$(): BehaviorSubject<T> {

        // If the stream was previously in an error state, recreate it.
        // NOTE: Anyone subscribed to the old error stream will not receive any further notifications until they re-get this stream.
        if (this.observable$.hasError) {
            this.observable$ = new BehaviorSubject<T>(this.initialValue);
        }

        return this.observable$;
    }

    // Set the data cache for this entry
    public set(data: T) {
        this.next(data);
    }

    // Get the cache data
    public get(): T {
        return this.data;
    }

    // Trigger the Observable stream - return a copy of the data
    public publish() {
        this.stream$.next(this.get());
    }

    // Push a stream event for this entry
    private next(data) {
        this.data = data;
        this.publish();
    }
}
