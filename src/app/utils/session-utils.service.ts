import _ from 'lodash';
import moment from 'moment';
import { Injectable } from '@angular/core';
import { Session } from '../models/session';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetAction, InvalidateAction } from '../store/session/session.actions';
import { User } from '../models/user';
import { filter } from 'rxjs/operators';
import { SessionState } from '../store/session/session.store';

@Injectable({ providedIn: "root" })
export class SessionUtils {

  public session$!: Observable<Session>;

  constructor(private store: Store) {
    this.session$ = store.select(SessionState.get);

    // Wait for the session to change...
    this.session$.pipe(
      filter<Session>(Boolean)
    ).subscribe((session) => {
      // Update the local store
      this.sessionStore = session;

      const updatedUsers = this.usersStore;
      updatedUsers.splice(_.findIndex(updatedUsers, { id: session.user.id }), 1, session.user);
      this.usersStore = updatedUsers;
    });
  }

  public get session(): Readonly<Session | undefined> {
    return this.sessionStore;
  }

  public init(user: User): Observable<Session> {
    const session = <any>{};
    session.expiresDate = moment().add(1, 'day').toISOString();
    session.user = user;

    this.sessionStore = session;

    this.store.dispatch(new SetAction(session));

    return of(session);
  }

  public invalidate() {
    this.sessionStore = undefined;
    this.store.dispatch(new InvalidateAction());
  }

  private get sessionStore(): Session | undefined {
    return localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')) : null;
  }

  private set sessionStore(session: Session | undefined) {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      localStorage.removeItem('session');
    }
  }

  private get usersStore(): User[] {
    return localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
  }

  private set usersStore(users: User[] | undefined) {
    localStorage.setItem('users', JSON.stringify(users || []));
  }
}
