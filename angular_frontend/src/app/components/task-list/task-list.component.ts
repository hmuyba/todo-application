import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

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
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id).subscribe(
          () => this.getTasks(), // Refresh the list
          error => console.error('Error deleting task', error)
        );
      }
    });
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
    const task = event.item.data as Task;
    const newStatus = this.normalizeStatus(event.container.id);
    const currentIndex = event.currentIndex;
  
    if (this.normalizeStatus(task.status) !== newStatus) {
      // Task is being moved to a different column
      const previousIndex = this.getTaskArrayByStatus(task.status).indexOf(task);
      
      // Remove the task from the original list
      this.getTaskArrayByStatus(task.status).splice(previousIndex, 1);
      
      // Add the task to the new list at the desired position
      const newList = this.getTaskArrayByStatus(newStatus);
      newList.splice(currentIndex, 0, task);
  
      // Update the task's status
      task.status = newStatus;
  
      // Update the task in the backend
      this.taskService.updateTask(task).subscribe(
        () => console.log('Task status updated successfully'),
        error => console.error('Error updating task status', error)
      );
    } else {
      // Task is being reordered within the same column
      this.reorderTasks(this.getTaskArrayByStatus(newStatus), event.previousIndex, currentIndex);
    }
  }
  
  
  reorderTasks(tasks: Task[], previousIndex: number, currentIndex: number): void {
    if (previousIndex !== currentIndex) {
      const [movedTask] = tasks.splice(previousIndex, 1); // Remove the task from its old position
      tasks.splice(currentIndex, 0, movedTask); // Insert the task into its new position
  
      // Optionally, save the new order to the backend
      // This would require adding a field to represent the order in the task model (e.g., "order" or "priority")
      // and sending an update request for the reordered tasks.
    }
  }
  
  getTaskArrayByStatus(status: string): Task[] {
    switch (status) {
      case 'TO_DO':
        return this.todoTasks;
      case 'IN_PROGRESS':
        return this.inProgressTasks;
      case 'DONE':
        return this.doneTasks;
      default:
        return [];
    }
  }
}
