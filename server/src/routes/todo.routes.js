import { Router } from 'express'
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from '../controllers/todo.controller.js'
import { validateTodo, validateTodoUpdate } from '../middleware/validate.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.use(authenticateToken)

router.get('/', getTodos)
router.post('/', validateTodo, createTodo)
router.put('/:id', validateTodoUpdate, updateTodo)
router.patch('/:id/toggle', toggleTodo)
router.delete('/:id', deleteTodo)

export default router
