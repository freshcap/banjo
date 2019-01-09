import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatRippleModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { Banjo } from './banjo';
import { FakeApi } from './fake.api';
import { GizmoService } from './gizmo.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        ReactiveFormsModule
    ],
    providers: [
        Banjo,
        FakeApi,
        GizmoService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
