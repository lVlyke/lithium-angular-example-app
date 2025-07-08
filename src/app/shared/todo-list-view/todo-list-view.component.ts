import _ from 'lodash';
import { Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, Injector, EventEmitter } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { filter, bufferTime, skip } from 'rxjs/operators';
import { ComponentStateRef, ComponentState, DeclareState, ManagedSubject } from '@lithiumjs/angular';
import { TodoList } from '../../models/todo-list';
import { BaseComponent } from '../../core/base-component';

@Component({
    selector: 'app-todo-list-view',
    templateUrl: './todo-list-view.component.html',
    styleUrls: ['./todo-list-view.component.scss'],
    imports: [
        MatListModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatInputModule
    ],
    providers: [
        ComponentState.create(TodoListViewComponent)
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListViewComponent extends BaseComponent {

  public readonly onCompleteItem$ = new ManagedSubject<[number, MatCheckbox]>(this);
  public readonly onAddTask$ = new ManagedSubject<string>(this);
  
  @Input()
  @DeclareState()
  public list!: TodoList;

  @Input()
  public name: string = '';

  @Output('listChanged')
  public readonly listChanged$ = new EventEmitter<TodoList>();

  constructor(
    injector: Injector,
    cdRef: ChangeDetectorRef,
    stateRef: ComponentStateRef<TodoListViewComponent>,
  ) {
    super(injector, cdRef);

    stateRef.get('list').pipe(skip(1)).subscribe(this.listChanged$);

    // Wait for items to be checked...
    this.onCompleteItem$.pipe(
      bufferTime(900),
      filter(items => items.length > 0)
    ).subscribe((collectedItems: [number, MatCheckbox][]) => {
      collectedItems.forEach(([index, checkbox]) => {
        // Move the item from the todo list to the completed list
        const item = this.list.todo[index];
        delete this.list.todo[index];
        this.list.completed.push(item);
        checkbox.checked = false;
      });

      // Filter out the deleted items
      this.list = Object.assign(this.list, {
        todo: this.list.todo.filter(Boolean)
      });
    });

    // Wait for a task to be added...
    this.onAddTask$.pipe(
      filter(item => item.length > 0)
    ).subscribe((item) => {
      // Add the item to the list
      this.list = Object.assign(this.list, {
        todo: this.list.todo.concat([item])
      });
    });
  }
}
