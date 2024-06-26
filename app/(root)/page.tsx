import CategoryFilter from '@/components/shared/CategoryFilter'
import Collection from '@/components/shared/Collection'
import Search from '@/components/shared/Search'
import { Button } from '@/components/ui/button'
import { getAllProjects } from '@/lib/actions/project.actions'
import { SearchParamProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1
  const searchText = (searchParams?.query as string) || ''
  const category = (searchParams?.category as string) || ''

  const projects = await getAllProjects({
    query: searchText,
    category,
    page,
    limit: 6,
  })

  return (
    <>
      <section className='bg-primary-50 bg-curved-pattern bg-contain py-5 md:py-10'>
        <div className='wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0'>
          <div className='flex flex-col justify-center gap-8'>
            <h1 className='h1-bold'>
              Hi, I'm Byron, I code, design, and make good coffee.
            </h1>
            <p className='p-regular-20 md:p-regular-24'>
              I'm a deep generalist who loves to work on a variety of projects.
              I'm best suited to work with leaders with a vision, and need
              someone to help them bring it to life.
            </p>
            <Button size='lg' asChild className='button w-full sm:w-fit'>
              <Link href='/contact'>Contact Me</Link>
            </Button>
          </div>

          <Image
            src='/assets/images/hero.png'
            alt='hero'
            width={1000}
            height={1000}
            className='max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]'
          />
        </div>
      </section>

      <section
        id='projects'
        className='wrapper my-8 flex flex-col gap-8 md:gap-12'
      >
        <p className='flex justify-center'>
          "If you want to go fast, go alone. If you want to go far, go
          together."
        </p>
        <h2 className='flex justify-center h2-bold'>Let's Work Together</h2>

        <div className='flex w-full flex-col gap-5 md:flex-row'>
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={projects?.data}
          emptyTitle='No Projects Found'
          emptyStateSubtext='Come back later'
          collectionType='All_Projects'
          limit={6}
          page={page}
          totalPages={projects?.totalPages}
        />
      </section>
    </>
  )
}
