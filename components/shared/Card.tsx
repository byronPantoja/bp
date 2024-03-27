import { IProject } from '@/lib/database/models/project.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'

type CardProps = {
  project: IProject
  hasOrderLink?: boolean
  hidePrice?: boolean
}

const Card = ({ project, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = auth()
  const userId = sessionClaims?.userId as string

  const isProjectCreator = userId === project.projectManager._id.toString()

  return (
    <div className='group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]'>
      <Link
        href={`/projects/${project._id}`}
        style={{ backgroundImage: `url(${project.imageUrl})` }}
        className='flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500'
      />
      {/* IS PROJECT CREATOR ... */}

      {isProjectCreator && !hidePrice && (
        <div className='absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all'>
          <Link href={`/projects/${project._id}/update`}>
            <Image
              src='/assets/icons/edit.svg'
              alt='edit'
              width={20}
              height={20}
            />
          </Link>

          <DeleteConfirmation projectId={project._id} />
        </div>
      )}

      <div className='flex min-h-[230px] flex-col gap-3 p-5 md:gap-4'>
        {!hidePrice && (
          <div className='flex gap-2'>
            <span className='p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60'>
              {project.isProbono ? 'FREE' : `$${project.investment}`}
            </span>
            <p className='p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1'>
              {project.category.name}
            </p>
          </div>
        )}

        <p className='p-medium-16 p-medium-18 text-grey-500'>
          {formatDateTime(project.startDateTime).dateTime}
        </p>

        <Link href={`/projects/${project._id}`}>
          <p className='p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black'>
            {project.title}
          </p>
        </Link>

        <div className='flex-between w-full'>
          <p className='p-medium-14 md:p-medium-16 text-grey-600'>
            {project.projectManager.firstName} {project.projectManager.lastName}
          </p>

          {hasOrderLink && (
            <Link
              href={`/orders?projectId=${project._id}`}
              className='flex gap-2'
            >
              <p className='text-primary-500'>Order Details</p>
              <Image
                src='/assets/icons/arrow.svg'
                alt='search'
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
