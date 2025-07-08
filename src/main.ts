import { enableProdMode, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { environment } from './environments/environment';
import { APP_ROUTES } from './app/routes';
import { AppComponent } from './app/app.component';
import { SessionState } from './app/store/session/session.store';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideAnimations(),
        provideStore([SessionState]),
        provideRouter(APP_ROUTES),
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: { hasBackdrop: false }
        }
    ]
}).catch(err => console.log(err));
