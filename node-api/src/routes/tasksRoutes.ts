import { Router, Request, Response } from "express";
import axios from 'axios';
import { TasksRepository } from "../repositories/tasksRepository";
import { error } from "console";

const router = Router();
const tasksRepository = new TasksRepository();

const SUPPORTED_LANGUAGES = ['pt', 'en', 'es'];

router.get("/", async (req: Request, res: Response) => {
  return res.json({ message: 'API is running'})
})

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/tasks", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    }

    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      return res.status(400).json({ error: 'Language not supported'});
    }

    // Cria a "tarefa"
    const task = tasksRepository.createTask(text, lang);

    // Deve solicitar o resumo do texto ao serviço Python
    const response = await axios.post(`${process.env.PYTHON_LLM_URL}/summarize`, {
      text,
      lang
    });

    const summary = response.data.summary;

    // Atualiza a tarefa com o resumo
    tasksRepository.updateTask(task.id, summary);

    // return res.status(201).json({
    //   task: tasksRepository.getTaskById(task.id),
    //   lang: lang
    // });

    return res.status(201).json({
      id: task.id,
      text: task.text,
      summary: summary,
      lang: lang
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// GET: Busca uma tarefa por ID
router.get("/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const task = tasksRepository.getTaskById(id);
  if (task) {
    return res.json(task.summary);
  } else {
    return res.status(404).json({ error: 'Task not found' });
  }
})

// GET: Lista todas as tarefas
router.get("/tasks/", (req, res) => {
  const tasks = tasksRepository.getAllTasks();
  return res.json(tasks);
});


// DELETE: Deleta uma tarefa por ID
router.delete("/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'invalid task ID' });
  }

  const success = tasksRepository.deleteTaskById(id);
  if (success) {
    return res.status(200).json({ message: 'Task deleted'});
  } else {
    return res.status(404).json({ error: 'Taks not found' });
  }
});

export default router;