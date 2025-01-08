import fs from 'fs';
import path from 'path';


interface Task {
  id: number;
  text: string;
  summary?: string;
  lang?: string;
}

const filePath = path.resolve(__dirname, 'tasks.json');

const readTasksFromFile = (): Task[] => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  if (data.trim().length === 0) {
    return [];
  }
  return JSON.parse(data);
};

const writeTasksToFile = (tasks: Task[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

export class TasksRepository {
  private tasks: Task[] = [];
  private currentId: number = 1;

  constructor() {
    this.tasks = readTasksFromFile();
    if (this.tasks.length > 0) {
      this.currentId = Math.max(...this.tasks.map(task => task.id)) + 1;
    }
  }

  createTask(text: string, lang: string): Task {
    const task: Task = {
      id: this.currentId++,
      text,
      lang
    };
    this.tasks.push(task);
    writeTasksToFile(this.tasks);
    return task;
  }

  updateTask(id: number, summary: string): void {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.summary = summary;
      writeTasksToFile(this.tasks);
    }
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find(t => t.id === id) || null;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  deleteTaskById(id: number): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      writeTasksToFile(this.tasks);
      return true;
    }
    return false;
  }
}