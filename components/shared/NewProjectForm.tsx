'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { projectFormSchema } from '@/lib/validator'
import * as z from 'zod'
import { projectDefaultValues } from '@/constants'
import Dropdown from './Dropdown'

import { FileUploader } from './FileUploader'
import { useState } from 'react'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import { useUploadThing } from '@/lib/uploadthing'
import { Textarea } from '@/components/ui/textarea'
import 'react-datepicker/dist/react-datepicker.css'
import { Checkbox } from '../ui/checkbox'
import { useRouter } from 'next/navigation'
import { createProject, updateProject } from '@/lib/actions/project.actions'
import { IProject } from '@/lib/database/models/project.model'

type ProjectFormProps = {
  userId: string
  type: 'Create' | 'Update'
  project?: IProject
  projectId?: string
}

const ProjectForm = ({
  userId,
  type,
  project,
  projectId,
}: ProjectFormProps) => {
  const [files, setFiles] = useState<File[]>([])
  const initialValues =
    project && type === 'Update'
      ? {
          ...project,
          startDateTime: new Date(project.startDateTime),
          endDateTime: new Date(project.endDateTime),
        }
      : projectDefaultValues
  const router = useRouter()

  const { startUpload } = useUploadThing('imageUploader')

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof projectFormSchema>) {
    let uploadedImageUrl = values.imageUrl

    if (files.length > 0) {
      const uploadedImages = await startUpload(files)

      if (!uploadedImages) {
        return
      }

      uploadedImageUrl = uploadedImages[0].url
    }

    if (type === 'Create') {
      try {
        const newProject = await createProject({
          project: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: '/profile',
        })

        if (newProject) {
          form.reset()
          router.push(`/projects/${newProject._id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (type === 'Update') {
      if (!projectId) {
        router.back()
        return
      }

      try {
        const updatedProject = await updateProject({
          userId,
          project: { ...values, imageUrl: uploadedImageUrl, _id: projectId },
          path: `/projects/${projectId}`,
        })

        if (updatedProject) {
          form.reset()
          router.push(`/projects/${updatedProject._id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    placeholder='Project title'
                    {...field}
                    className='input-field'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='purpose'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl className='h-72'>
                  <Textarea
                    placeholder='Project purpose'
                    {...field}
                    className='textarea rounded-2xl'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl className='h-72'>
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='investment'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl className='h-72'>
                  <Textarea
                    placeholder='Investment'
                    {...field}
                    className='textarea rounded-2xl'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='benefits'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl className='h-72'>
                  <Textarea
                    placeholder='Benefits'
                    {...field}
                    className='textarea rounded-2xl'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    {/* TODO: Replace with PH Peso svg */}
                    <Image
                      src='/assets/icons/dollar.svg'
                      alt='dollar'
                      width={24}
                      height={24}
                      className='filter-grey'
                    />
                    <Input
                      type='number'
                      placeholder='Total Cost'
                      {...field}
                      className='p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                    />
                    <FormField
                      control={form.control}
                      name='isProbono'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='flex items-center'>
                              <label
                                htmlFor='isProbono'
                                className='whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                              >
                                Pro Bono
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id='isProbono'
                                className='mr-2 h-5 w-5 border-2 border-primary-500'
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image
                      src='/assets/icons/link.svg'
                      alt='link'
                      width={24}
                      height={24}
                    />

                    <Input
                      placeholder='URL'
                      {...field}
                      className='input-field'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='startDateTime'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image
                      src='/assets/icons/calendar.svg'
                      alt='calendar'
                      width={24}
                      height={24}
                      className='filter-grey'
                    />
                    <p className='ml-3 whitespace-nowrap text-grey-600'>
                      Start Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel='Time:'
                      dateFormat='MM/dd/yyyy h:mm aa'
                      wrapperClassName='datePicker'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endDateTime'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image
                      src='/assets/icons/calendar.svg'
                      alt='calendar'
                      width={24}
                      height={24}
                      className='filter-grey'
                    />
                    <p className='ml-3 whitespace-nowrap text-grey-600'>
                      End Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel='Time:'
                      dateFormat='MM/dd/yyyy h:mm aa'
                      wrapperClassName='datePicker'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                    <Image
                      src='/assets/icons/location-grey.svg'
                      alt='calendar'
                      width={24}
                      height={24}
                    />

                    <Input
                      placeholder='Project location or Online'
                      {...field}
                      className='input-field'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          size='lg'
          disabled={form.formState.isSubmitting}
          className='button col-span-2 w-full'
        >
          {form.formState.isSubmitting ? 'Submitting...' : `${type} Project `}
        </Button>
      </form>
    </Form>
  )
}

export default ProjectForm
