import { Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Subject, Observable } from 'rxjs';
import { TodoList } from '../../models/todo-list';
import { withLatestFrom, filter, bufferTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-todo-list-view',
  templateUrl: './todo-list-view.component.html',
  styleUrls: ['./todo-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListViewComponent extends BaseComponent {

  @EventSource()
  private readonly onCompleteItem$: Observable<[number, MatCheckbox]>;

  @EventSource()
  private readonly onAddTask$: Observable<string>;

  @Output('listChanged')
  @StateEmitter()
  @Input('list')
  private readonly list$: Subject<TodoList>;

  @StateEmitter()
  @Input('name')
  public readonly name$: Subject<string>;

  constructor(injector: Injector, cdRef: ChangeDetectorRef) {
    super(injector, cdRef);

    // Wait for items to be checked...
    this.onCompleteItem$.pipe(
      bufferTime(900),
      filter(items => items.length > 0),
      withLatestFrom(this.list$)
    ).subscribe(([collectedItems, list]: [[number, MatCheckbox][], TodoList]) => {
      collectedItems.forEach(([index, checkbox]) => {
        // Move the item from the todo list to the completed list
        const item = list.todo[index];
        delete list.todo[index];
        list.completed.push(item);
        checkbox.checked = false;
      });

      // Filter out the deleted items
      list.todo = list.todo.filter(Boolean);

      this.list$.next(list);
    });

    // Wait for a task to be added...
    this.onAddTask$.pipe(
      filter(item => item.length > 0),
      withLatestFrom(this.list$)
    ).subscribe(([item, list]: [string, TodoList]) => {
      // Add the item to the list
      list.todo.push(item);
      this.list$.next(list);
    });
  }
}
