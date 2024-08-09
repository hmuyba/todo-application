package com.example.todo.service;

import com.example.todo.model.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    Task saveTask(Task task);
    Optional<Task> getTaskById(Long id);
    List<Task> getAllTasks();
    void deleteTask(Long id);
    Task updateTask(Long id, Task task);
}
