//TODO: принимать таски, запускать и отправлять ответ
//TODO: продумать формат ответа
//TODO: Отправлять задачи из базы данных
const { Router } = require("express");
const Part = require("../models/Part");
const auth = require("../middleware/auth.middleware");

const router = Router();

router.get("/parts/:id", auth, async (req, res) => {
  try {
    const part = await Part.findOne({ number: req.params.id });
    if (!part) {
      return res.status(400).json({ message: "Part does not exist" });
    }
    res.json(part);
  } catch (error) {
    res.status(500).json({ message: "Part is not received. Try again" });
  }
});

router.get("/parts/:partId/tasks/:taskId", auth, async (req, res) => {
  try {
    const part = await Part.findOne({ number: req.params.partId });
    if (!part) {
      return res.status(400).json({ message: "Part does not exist" });
    }
    const task = part.tasks[req.params.taskId];
    if (!task) {
      return res.status(400).json({ message: "Task does not exist" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Task is not received. Try again" });
  }
});

router.post("/verify/parts/:partId/tasks/:taskId", auth, async (req, res) => {
  try {
    //TODO: здесь делать проверку
    const part = await Part.findOne({ number: req.params.partId });
    const task = part.tasks[req.params.taskId];
    const { answer } = req.body;
    // Если проверка успешная
    res.status(201).json({ rightAnswer: true });
    // Иначе
    res.status(201).json({ rightAnswer: false });
  } catch (error) {
    res.status(500).json({ message: "Failed to save. Try again" });
  }
});

module.exports = router;
