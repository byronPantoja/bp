import React, { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

import { IProject } from '@/lib/database/models/project.model'
import { Button } from '../ui/button'
import { checkoutOrder } from '@/lib/actions/order.actions'

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const Checkout = ({
  project,
  userId,
}: {
  project: IProject
  userId: string
}) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.')
    }

    if (query.get('canceled')) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      )
    }
  }, [])

  const onCheckout = async () => {
    const order = {
      eventTitle: project.title,
      eventId: project._id,
      investment: project.investment,
      isProbono: project.isProbono,
      buyerId: userId,
    }

    await checkoutOrder(order)
  }

  return (
    <form action={onCheckout} method='post'>
      <Button type='submit' role='link' size='lg' className='button sm:w-fit'>
        {project.isProbono ? 'Interested' : 'Not Interested'}
      </Button>
    </form>
  )
}

export default Checkout
