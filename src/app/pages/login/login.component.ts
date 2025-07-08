import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EMPTY } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { ComponentState } from '@lithiumjs/angular';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        FormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatSnackBarModule
    ],
    providers: [
        ComponentState.create(LoginComponent)
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends EntryBasePage {

  constructor(
    injector: Injector,
    cdRef: ChangeDetectorRef,
    router: Router,
    userUtils: UserUtils,
    snackBar: MatSnackBar
  ) {
    super(injector, cdRef, snackBar);

    this.onSubmit$.pipe(
      mergeMap(() => {
        return userUtils.login(this.username, this.password).pipe(
          catchError((error) => {
            this.error = error;
            return EMPTY;
          })
        );
      }),
    ).subscribe(() => {
      // Go to the home page
      router.navigate(['/home']);
    });
  }
}
