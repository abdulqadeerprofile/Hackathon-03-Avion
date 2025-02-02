export interface Category {
    _id: string
    name: string
    slug: string
  }
  
  export interface Dimensions {
    width: string
    height: string
    depth: string
  }
  
  export interface Product {
    name: string
    description: string
    image: string
    _id: string
    features: string[]
    dimensions: Dimensions
    category: {
      _id: string
      name: string
      slug: string
    }
    price: number
    tags: string[]
    quantity: number
  }
  
  export interface User {
    uid: string
    displayName: string
    email: string
    userType: string
  }
  