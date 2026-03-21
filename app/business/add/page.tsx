'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBusiness } from '@/context/business'
import { BusinessState } from '@/utils/types/business'

interface InputField {
  name: string
  type: string
  label: string
  required?: boolean
  accept?: string
}

const inputFields: InputField[] = [
  {
    name: 'name',
    label: 'Business Name',
    type: 'text',
    required: true,
  },
  {
    name: 'category',
    label: 'Category',
    type: 'text',
    required: true,
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
  },
  {
    name: 'website',
    label: 'Website',
    type: 'url',
  },
  {
    name: 'hours',
    label: 'Opening Hours',
    type: 'text',
  },
  {
    name: 'businessNumber',
    label: 'Business Number',
    type: 'number',
  },
  {
    name: 'logo',
    label: 'logo',
    type: 'file',
    accept: 'image/*'
  },
]

export default function AddBusinessPage() {
  const { business, handleChange, handleSubmit } = useBusiness()

  return (
    <div className='flex flex-col lg:flex-row h-screen'>
      <div className='flex flex-col lg:w-1/2 p-4 lg:order-last lg:flex lg:justify-center lg:items-center overflow-y-auto'>Preview</div>
      <div className='flex flex-col lg:w-1/2 p-4 lg:order-first lg:flex overflow-y-auto'>
      <h1 className='text-center text-main-dark text-lg'>Please fill out the form to register your business with us.</h1>
        {inputFields.map(( item, index ) => (
          <div 
            key={index}
            className='w-full my-2'
          >
            <Label 
              htmlFor={item.name}
              className='capitalize'
            >
              {item.name}
            </Label>
            <Input 
              name={item.name}
              type={item.type}
              required={item.required}
              onChange={handleChange}
              value={(business[item.name as keyof BusinessState] || '') as 
                | string
                | number
              }
            />
          </div>
        ))}
        <Button
          onClick={handleSubmit}
          type='submit'
          className='my-5'
        >
          Submit
        </Button>
      </div>
    </div>
  )
}