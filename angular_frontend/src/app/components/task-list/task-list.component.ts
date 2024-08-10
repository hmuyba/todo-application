import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTasks();
  }

  // Normalizer function to standardize status
  normalizeStatus(status: string): string {
    return status.toUpperCase().replace('-', '_');
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks: Task[]) => {
        this.todoTasks = tasks.filter(task => 
          task.status === 'TO_DO' || task.status === 'TO DO' || task.status === 'to_do'
        );
        this.inProgressTasks = tasks.filter(task => 
          task.status === 'IN_PROGRESS' || task.status === 'IN PROGRESS' || task.status === 'in_progress'
        );
        this.doneTasks = tasks.filter(task => 
          task.status === 'DONE' || task.status === 'Done' || task.status === 'done'
        );
      },
      error => console.error('Error fetching tasks', error)
    );
  }
  
  

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(
      () => this.getTasks(), // Refresh the list
      error => console.error('Error deleting task', error)
    );
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
      data: task // Pass the current task data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.getTasks(); // Refresh the task list after editing
      }
    });
  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.getTasks(); // Refresh the task list after creating
      }
    });
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    console.log('Dropped event:', event);
    const task = event.item.data as Task;
    console.log('Task:', task);

    // Normalize the new status from the container ID
    const newStatus = this.normalizeStatus(event.container.id);
    console.log('New Status:', newStatus);

    if (this.normalizeStatus(task.status) !== newStatus) {
      task.status = newStatus;
      this.taskService.updateTask(task).subscribe(
        () => this.getTasks(), // Refresh the list
        error => console.error('Error updating task status', error)
      );
    }
  }
}
