'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { BusinessState } from '@/utils/types/business'

const initialState: BusinessState = {
  _id: '',
  userEmail: '',
  name: '',
  category: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  hours: '',
  logo: '',
  businessNumber: '',
  slug: '',
  createdAt: '',
  updatedAt: '',
  __v: 0
}

interface BusinessContextType {
  business: BusinessState
  setBusiness: React.Dispatch<React.SetStateAction<BusinessState>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
)

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessState>(initialState)
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBusiness((prevBusiness: BusinessState) =>  {
      const updatedBusiness = {
        ...prevBusiness, 
        [name]: value  
      }
      return updatedBusiness
    }) 
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(business)
  }

  return (
    <BusinessContext.Provider
      value={{
        business, 
        setBusiness, 
        loading, 
        setLoading, 
        handleChange, 
        handleSubmit,
      }}
    >
      {children}
    </BusinessContext.Provider>
  )
}

export const useBusiness = () => {
  const context = useContext(BusinessContext)

  if (context === undefined) {
    throw new Error('useContext must be used within a BusinessProvider.')
  }
  return context
}

