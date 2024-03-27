'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/project.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'

import {
  CreateProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
  GetProjectsByUserParams,
  GetRelatedProjectsByCategoryParams,
  GetAllProjectsParams,
} from '@/types'
import Project from '@/lib/database/models/project.model'

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateProject = (query: any) => {
  return query
    .populate({
      path: 'organizer',
      model: User,
      select: '_id firstName lastName',
    })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
export async function createProject({
  userId,
  project,
  path,
}: CreateProjectParams) {
  try {
    await connectToDatabase()

    const organizer = await User.findById(userId)
    if (!organizer) throw new Error('Organizer not found')

    const newProject = await Project.create({
      ...project,
      category: project.categoryId,
      organizer: userId,
    })
    revalidatePath(path)

    return JSON.parse(JSON.stringify(newProject))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE PROJECT BY ID
export async function getProjectById(projectId: string) {
  try {
    await connectToDatabase()

    const project = await populateProject(Project.findById(projectId))

    if (!project) throw new Error('Project not found')

    return JSON.parse(JSON.stringify(project))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateProject({
  userId,
  project,
  path,
}: UpdateProjectParams) {
  try {
    await connectToDatabase()

    const projectToUpdate = await Project.findById(project._id)
    if (
      !projectToUpdate ||
      projectToUpdate.organizer.toHexString() !== userId
    ) {
      throw new Error('Unauthorized or project not found')
    }

    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      { ...project, category: project.categoryId },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedProject))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteProject({ projectId, path }: DeleteProjectParams) {
  try {
    await connectToDatabase()

    const deletedProject = await Project.findByIdAndDelete(projectId)
    if (deletedProject) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

// GET ALL PROJECTS
export async function getAllProjects({
  query,
  limit = 6,
  page,
  category,
}: GetAllProjectsParams) {
  try {
    await connectToDatabase()

    const titleCondition = query
      ? { title: { $regex: query, $options: 'i' } }
      : {}
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    }

    const skipAmount = (Number(page) - 1) * limit
    const projectQuery = Project.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const projects = await populateProject(projectQuery)
    const projectsCount = await Project.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(projects)),
      totalPages: Math.ceil(projectsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET PROJECT BY ORGANIZER
export async function getProjectsByUser({
  userId,
  limit = 6,
  page,
}: GetProjectsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit

    const projectQuery = Project.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const project = await populateProject(projectQuery)
    const projectsCount = await Project.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(project)),
      totalPages: Math.ceil(projectsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET RELATED PROJECTS: PROJECTS WITH SAME CATEGORY
export async function getRelatedProjectsByCategory({
  categoryId,
  projectId,
  limit = 3,
  page = 1,
}: GetRelatedProjectsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: projectId } }],
    }

    const projectQuery = Project.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const projects = await populateProject(projectQuery)
    const projectCount = await Project.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(projects)),
      totalPages: Math.ceil(projectCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}
