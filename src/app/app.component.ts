import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { UserUtils } from './utils/user-utils.service';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { SessionState } from './store/session/session.store';
import { Observable } from 'rxjs';
import { BaseComponent } from './core/base-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends BaseComponent {

  @Select(SessionState.hideBanner)
  public readonly hideBanner$: Observable<boolean>;

  constructor(injector: Injector, cdRef: ChangeDetectorRef, userUtils: UserUtils, router: Router) {
    super(injector, cdRef);

    // Navigate the user to the home page if already logged in
    userUtils.loginFromStore().subscribe(
      () => router.navigate(['/home']),
      console.info
    );
  }
}
