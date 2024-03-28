import Collection from '@/components/shared/Collection'
import {
  getProjectById,
  getRelatedProjectsByCategory,
} from '@/lib/actions/project.actions'
import { formatDateTime } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import Image from 'next/image'

const ProjectDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const project = await getProjectById(id)

  const relatedProjects = await getRelatedProjectsByCategory({
    categoryId: project.category._id,
    projectId: project._id,
    page: searchParams.page as string,
  })

  return (
    <>
      <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain'>
        <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
          <Image
            src={project.imageUrl}
            alt='hero image'
            width={1000}
            height={1000}
            className='h-full min-h-[300px] object-cover object-center'
          />
          <div className='flex w-full flex-col gap-8 p-5 md:p-10'>
            <div className='flex flex-col gap-6'>
              <h2 className='h2-bold'>{project.title}</h2>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <p className='p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700'>
                    {project.isProbono ? 'Pro Bono' : `$${project.price}`}
                  </p>
                  <p className='p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500'>
                    {project.category.name}
                  </p>
                </div>

                <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>
                  work by{' '}
                  <span>
                    {project.projectManager.firstName}{' '}
                    {project.projectManager.lastName}
                  </span>
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-5'>
              <div className='flex gap-2 md:gap-3'>
                <Image
                  src='/assets/icons/calendar.svg'
                  alt='calendar'
                  width={32}
                  height={32}
                />
                <div className='p-medium-16 lg:p-regular-20 flex flex-wrap items-center'>
                  <p>
                    {formatDateTime(project.startDateTime).dateOnly} -{' '}
                    {formatDateTime(project.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(project.endDateTime).dateOnly} -{' '}
                    {formatDateTime(project.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className='p-regular-20 flex items-center gap-3'>
                <Image
                  src='/assets/icons/location.svg'
                  alt='location'
                  width={32}
                  height={32}
                />
                <p className='p-medium-16 lg:p-regular-20'>
                  {project.location}
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='h3-bold py-4'>Project's Foundation:</h3>
              <p className='p-medium-16 lg:p-regular-18'>
                <span className='p-bold-20 text-grey-600'>Purpose: </span>
                {project.purpose}
              </p>
              <p className='p-medium-16 lg:p-regular-18'>
                {project.benefits}
                <span className='p-bold-20 text-grey-600'>Benefits: </span>
              </p>
              <p className='p-medium-16 lg:p-regular-18'>
                <span className='p-bold-20 text-grey-600'>Investment: </span>
                {project.investment}
              </p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className=' text-grey-600'>
                See More about this project here:{' '}
              </p>
              <p className='p-medium-16 lg:p-regular-18 truncate text-primary-500 underline'>
                {project.url}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project with the same category */}
      <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
        <h2 className='h2-bold'>Related Projects</h2>

        <Collection
          data={relatedProjects?.data}
          emptyTitle='No Projects Found'
          emptyStateSubtext='Come back later'
          collectionType='All_Projects'
          limit={3}
          page={searchParams.page as string}
          totalPages={relatedProjects?.totalPages}
        />
      </section>
    </>
  )
}

export default ProjectDetails
