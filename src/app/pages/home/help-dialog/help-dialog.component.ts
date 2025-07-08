import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { AsyncState, ComponentState, ComponentStateRef } from '@lithiumjs/angular';
import { Store } from '@ngxs/store';
import { SessionState } from '../../../store/session/session.store';
import { HideBannerAction } from '../../../store/session/session.actions';
import { BaseComponent } from '../../../core/base-component';

@Component({
    selector: 'app-help-dialog',
    templateUrl: './help-dialog.component.html',
    styleUrls: ['./help-dialog.component.scss'],
    imports: [
        FormsModule,
        MatDialogModule,
        MatListModule,
        MatCheckboxModule,
        MatButtonModule
    ],
    providers: [
        ComponentState.create(HelpDialogComponent)
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpDialogComponent extends BaseComponent {

  public readonly hideBanner$!: Observable<boolean>;

  @AsyncState()
  public hideBanner!: boolean;

  constructor(injector: Injector, cdRef: ChangeDetectorRef, stateRef: ComponentStateRef<HelpDialogComponent>, store: Store) {
    super(injector, cdRef);

    this.hideBanner$ = store.select(SessionState.hideBanner);

    stateRef.get('hideBanner').subscribe(hideBanner => store.dispatch(new HideBannerAction(hideBanner)));
  }
}
