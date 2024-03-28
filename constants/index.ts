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
  purpose: '',
  investment: '',
  benefits: '',
  price: '',
  isProbono: false,
  imageUrl: '',
  location: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  url: '',
  categoryId: '',
}
