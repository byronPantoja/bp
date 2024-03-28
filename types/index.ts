// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}

export type UpdateUserParams = {
  firstName: string
  lastName: string
  username: string
  photo: string
}

// ====== PROJECT PARAMS
export type CreateProjectParams = {
  userId: string
  project: {
    title: string
    purpose: string
    investment: string
    price: string
    benefits: string
    isProbono: boolean
    imageUrl: string
    location: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    url: string
  }
  path: string
}

export type UpdateProjectParams = {
  userId: string
  project: {
    _id: string
    title: string
    purpose: string
    investment: string
    price: string
    benefits: string
    isProbono: boolean
    imageUrl: string
    location: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    url: string
  }
  path: string
}

export type DeleteProjectParams = {
  projectId: string
  path: string
}

export type GetAllProjectsParams = {
  query: string
  category: string
  limit: number
  page: number
}

export type GetProjectsByUserParams = {
  userId: string
  limit?: number
  page: number
}

export type GetRelatedProjectsByCategoryParams = {
  categoryId: string
  projectId: string
  limit?: number
  page: number | string
}

export type Project = {
  _id: string
  title: string
  purpose: string
  investment: string
  price: string
  benefits: string
  isProbono: boolean
  imageUrl: string
  location: string
  startDateTime: Date
  endDateTime: Date
  url: string
  projectManager: {
    _id: string
    firstName: string
    lastName: string
  }
  category: {
    _id: string
    name: string
  }
}

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string
}

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  projectTitle: string
  projectId: string
  investment: string
  isProbono: boolean
  price: string
  buyerId: string
}

export type CreateOrderParams = {
  stripeId: string
  projectId: string
  buyerId: string
  totalAmount: string
  createdAt: Date
}

export type GetOrdersByProjectParams = {
  projectId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
