import { RegisterComponent } from './pages/register/register.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { RoutesModule } from './routes.module';
import { NgxsModule } from '@ngxs/store';
import { SessionState } from './store/session/session.store';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UserUtils } from './utils/user-utils.service';
import { SessionUtils } from './utils/session-utils.service';
import { AuthGuard } from './guards/auth-guard.service';
import { TodoListViewComponent } from './shared/todo-list-view/todo-list-view.component';
import { DeleteDialogComponent } from './pages/home/delete-dialog/delete-dialog.component';
import { HelpDialogComponent } from './pages/home/help-dialog/help-dialog.component';
import { AppBannerComponent } from './shared/app-banner/app-banner.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        TodoListViewComponent,
        DeleteDialogComponent,
        HelpDialogComponent,
        AppBannerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatInputModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatRadioModule,
        MatIconModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatDialogModule,
        MatRippleModule,
        NgxsModule.forRoot([
            SessionState
        ]),
        RoutesModule
    ],
    providers: [
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: { hasBackdrop: false }
        },
        UserUtils,
        SessionUtils,
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
