import NewProjectForm from '@/components/shared/NewProjectForm'
import { auth } from '@clerk/nextjs'

const UpdateProject = () => {
  const { sessionClaims } = auth()

  const userId = sessionClaims?.userId as string
  console.log(userId)
  return (
    <>
      <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>
          Update Project
        </h3>
      </section>

      <div className='wrapper my-8'>
        <NewProjectForm userId={userId} type='Create' />
      </div>
    </>
  )
}

export default UpdateProject
