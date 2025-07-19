import url from '@/constants/urls'
import { getAccessTokenHelper } from '@/lib/authHelper'

export const getPharmacyOrdersFn = async (patientId: number) => {
  const fullUrl = `${url}/patients/pharmacy_orders/${patientId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacy orders')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : [data] // Ensure we return an array
}

export const createPharmacyOrderFn = async (orderData: any) => {
  const fullUrl = `${url}/pharmacy-orders`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })

  // if (!response.ok) {
  //   throw new Error('Failed to create pharmacy order');
  // }

  const data = await response.json()
  return data // Return the created order data
}
