'use server'

import Stripe from 'stripe'
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByProjectParams,
  GetOrdersByUserParams,
} from '@/types'
import { redirect } from 'next/navigation'
import { handleError } from '../utils'
import { connectToDatabase } from '../database'
import Order from '../database/models/order.model'
import { ObjectId } from 'mongodb'
import User from '../database/models/user.model'
import Project from '../database/models/project.model'

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const price = order.isFree ? 0 : Number(order.price) * 100

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        projectId: order.projectId,
        buyerId: order.buyerId,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    })

    redirect(session.url!)
  } catch (error) {
    throw error
  }
}

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase()

    const newOrder = await Order.create({
      ...order,
      project: order.projectId,
      buyer: order.buyerId,
    })

    return JSON.parse(JSON.stringify(newOrder))
  } catch (error) {
    handleError(error)
  }
}

// GET ORDERS BY Project
export async function getOrdersByProject({
  searchString,
  projectId,
}: GetOrdersByProjectParams) {
  try {
    await connectToDatabase()

    if (!projectId) throw new Error('Project ID is required')
    const projectObjectId = new ObjectId(projectId)

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      {
        $unwind: '$buyer',
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project',
        },
      },
      {
        $unwind: '$project',
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          projectTitle: '$project.title',
          projectId: '$project._id',
          buyer: {
            $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
          },
        },
      },
      {
        $match: {
          $and: [
            { projectId: projectObjectId },
            { buyer: { $regex: RegExp(searchString, 'i') } },
          ],
        },
      },
    ])

    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    handleError(error)
  }
}

// GET ORDERS BY USER
export async function getOrdersByUser({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { buyer: userId }

    const orders = await Order.distinct('project._id')
      .find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'project',
        model: Project,
        populate: {
          path: 'organizer',
          model: User,
          select: '_id firstName lastName',
        },
      })

    const ordersCount = await Order.distinct('event._id').countDocuments(
      conditions
    )

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}
