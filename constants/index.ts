export const headerLinks = [
  {
    label: 'Create Project',
    route: '/projects/create',
  },
  {
    label: 'My Profile',
    route: '/profile',
  },
]

export const projectDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
}
