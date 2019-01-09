import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { pipe } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Gizmo } from './data.models';
import { GizmoService } from './gizmo.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    title = 'Banjo ~ Angular Demo';
    gizmos: Gizmo[];
    gettingAllGizmos = false;

    selectedGizmoId = 0;
    selectedGizmo: Gizmo;
    notFound = false;
    gettingOneGizmo = false;

    gizmoForm: FormGroup;
    editing = false;
    saving = false;

    private active = true;

    constructor(private formBuilder: FormBuilder, private gizmoService: GizmoService) {

        // Subscribe to the cache.
        // The display will be updated whenever the data is emitted.
        // This is a continuous feed, so don't forget to unsubscribe.
        this.gizmoService.gizmos$().pipe(takeWhile(x => this.active)).subscribe(gizmos => {
            this.gizmos = gizmos;
            this.gizmos.sort((a, b) => a.id < b.id ? -1 : 1);
            this.selectedGizmo = this.gizmos.find(gizmo => gizmo.id === this.selectedGizmoId);
        });

        this.gizmoForm = this.formBuilder.group({
            name: [''],
            description: ['']
        });
    }

    ngOnDestroy() {
        this.active = false;
    }

    // Tell the service to get all the gizmos.
    getAllGizmos() {
        this.gettingAllGizmos = true;
        this.gizmoService.getAllGizmos().subscribe(x => this.gettingAllGizmos = false);
    }

    // Tell the service to get a specific gizmo
    getGizmoById(idString: string) {
        this.selectedGizmoId = Number(idString);
        this.selectedGizmo = null;
        this.notFound = false;
        this.gettingOneGizmo = true;
        this.gizmoService.getGizmo(this.selectedGizmoId).subscribe(
            x => { },
            err => {
                this.gettingOneGizmo = false;
                this.notFound = true;
            },
            () => this.gettingOneGizmo = false);
    }

    // Reset the local copy of the data to clear the display.
    clearDisplay() {
        this.gizmos = [];
        this.selectedGizmo = null;
    }

    // Tell the service to clear out the cache (for demo purposes).
    clearCache() {
        this.gizmoService.clearCacheForDemo();
    }

    // Set the form values and enable edit mode.
    edit() {
        if (!this.selectedGizmo) {
            return;
        }

        this.gizmoForm.controls.name.setValue(this.selectedGizmo.name);
        this.gizmoForm.controls.description.setValue(this.selectedGizmo.description);
        this.editing = true;
    }

    // Cancel edit mode.
    cancel() {
        this.editing = false;
    }

    // Send a copy of the edit-form gizmo to the service - on success, exit edit mode.
    // After the API update, the service will update the cache with the new value and publish.
    save() {
        const updatedGizmo: Gizmo = {
            id: this.selectedGizmo.id,
            name: this.gizmoForm.controls.name.value,
            description: this.gizmoForm.controls.description.value
        };

        this.saving = true;
        this.gizmoService.updateGizmo(updatedGizmo).subscribe(x => {
            this.editing = false;
            this.saving = false;
        });
    }
}
