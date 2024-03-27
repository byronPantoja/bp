'use client'

import { IProject } from '@/lib/database/models/project.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'

const CheckoutButton = ({ project }: { project: IProject }) => {
  const { user } = useUser()
  const userId = user?.publicMetadata.userId as string
  const hasProjectFinished = new Date(project.endDateTime) < new Date()

  return (
    <div className='flex items-center gap-3'>
      {hasProjectFinished ? (
        <p className='p-2 text-red-400'>
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className='button rounded-full' size='lg'>
              <Link href='/sign-in'>Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout project={project} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  )
}

export default CheckoutButton
