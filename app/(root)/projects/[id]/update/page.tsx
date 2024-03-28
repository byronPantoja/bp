import ProjectForm from '@/components/shared/NewProjectForm'
import { getProjectById } from '@/lib/actions/project.actions'
import { auth } from '@clerk/nextjs'

type UpdateProjectProps = {
  params: {
    id: string
  }
}

const UpdateProject = async ({ params: { id } }: UpdateProjectProps) => {
  const { sessionClaims } = auth()

  const userId = sessionClaims?.userId as string
  const project = await getProjectById(id)

  return (
    <>
      <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>
          Update Project
        </h3>
      </section>

      <div className='wrapper my-8'>
        <ProjectForm
          type='Update'
          project={project}
          projectId={project._id}
          userId={userId}
        />
      </div>
    </>
  )
}

export default UpdateProject
