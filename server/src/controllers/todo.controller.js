import { prisma } from '../config/db.js'
import { sendError } from '../utils/errors.js'
import { logActivity } from '../utils/activity.js'

export const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId
    const { search, status, priority, sort } = req.query

    const whereClause = { userId }

    if (status === 'active') {
      whereClause.completed = false
    } else if (status === 'completed') {
      whereClause.completed = true
    }

    if (priority && priority !== 'all') {
      whereClause.priority = priority
    }

    if (search && search.trim()) {
      const query = search.trim()
      whereClause.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
      ]
    }

    let orderBy = { createdAt: 'desc' }
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' }
    } else if (sort === 'title') {
      orderBy = { title: 'asc' }
    } else if (sort === 'dueDate') {
      orderBy = { dueDate: 'asc' }
    }

    const todos = await prisma.todo.findMany({
      where: whereClause,
      orderBy,
    })

    return res.json({ todos })
  } catch (error) {
    console.error('GetTodos Error:', error)
    return sendError(res, 500, 'Failed to retrieve todos')
  }
}

export const createTodo = async (req, res) => {
  try {
    const userId = req.user.userId
    const { title, description, priority, dueDate } = req.body

    const newTodo = await prisma.todo.create({
      data: {
        userId,
        title: title.trim(),
        description: description ? description.trim() : '',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    await logActivity(userId, 'TASK_CREATED', `Created task: "${newTodo.title}"`)

    return res.status(201).json({ todo: newTodo })
  } catch (error) {
    console.error('CreateTodo Error:', error)
    return sendError(res, 500, 'Failed to create todo')
  }
}

export const updateTodo = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { title, description, completed, priority, dueDate } = req.body

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })

    if (!existingTodo) {
      return sendError(res, 404, 'Todo item not found')
    }

    if (existingTodo.userId !== userId) {
      return sendError(res, 403, 'Forbidden: You do not own this resource')
    }

    const updateData = {}
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description.trim()
    if (completed !== undefined) updateData.completed = Boolean(completed)
    if (priority !== undefined) updateData.priority = priority
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData,
    })

    await logActivity(userId, 'TASK_UPDATED', `Updated task: "${updatedTodo.title}"`)

    return res.json({ todo: updatedTodo })
  } catch (error) {
    console.error('UpdateTodo Error:', error)
    return sendError(res, 500, 'Failed to update todo')
  }
}

export const toggleTodo = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })

    if (!existingTodo) {
      return sendError(res, 404, 'Todo item not found')
    }

    if (existingTodo.userId !== userId) {
      return sendError(res, 403, 'Forbidden: You do not own this resource')
    }

    const nextState = !existingTodo.completed
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed: nextState },
    })

    const actionText = nextState ? 'Completed' : 'Reopened'
    await logActivity(userId, nextState ? 'TASK_COMPLETED' : 'TASK_REOPENED', `${actionText} task: "${updatedTodo.title}"`)

    return res.json({ todo: updatedTodo })
  } catch (error) {
    console.error('ToggleTodo Error:', error)
    return sendError(res, 500, 'Failed to toggle todo status')
  }
}

export const deleteTodo = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })

    if (!existingTodo) {
      return sendError(res, 404, 'Todo item not found')
    }

    if (existingTodo.userId !== userId) {
      return sendError(res, 403, 'Forbidden: You do not own this resource')
    }

    await prisma.todo.delete({
      where: { id },
    })

    await logActivity(userId, 'TASK_DELETED', `Deleted task: "${existingTodo.title}"`)

    return res.json({ message: 'Todo item deleted successfully' })
  } catch (error) {
    console.error('DeleteTodo Error:', error)
    return sendError(res, 500, 'Failed to delete todo')
  }
}
