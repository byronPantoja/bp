export const headerLinks = [
  {
    label: 'Add Projects',
    route: '/projects/add',
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
