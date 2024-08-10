import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.taskForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.data) {
      const updatedTask: Task = { ...this.data, ...this.taskForm.value };
      this.taskService.updateTask(updatedTask).subscribe(
        () => this.dialogRef.close('updated'),
        error => console.error('Error updating task', error)
      );
    } else {
      this.taskService.createTask(this.taskForm.value).subscribe(
        () => this.dialogRef.close('created'),
        error => console.error('Error creating task', error)
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
