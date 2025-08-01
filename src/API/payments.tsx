// API/patients.ts
import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";
import type { TPayment } from "@/Types/types";

export const getPaymentsFn = async (page = 1, limit = 10, search = ''): Promise<{
  data: TPayment[];
  total: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search
  });

  const fullUrl = `${url}/payments?${params.toString()}`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const deletePaymentsFn = async (paymentId: number): Promise<void> => {
  const fullUrl = `${url}/payments/${paymentId}`;

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete payment');
  }
}

export const initPaymentFn = async (paymentData: TPayment): Promise<TPayment> => {
  const fullUrl = `${url}/payments/init`;

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment');
  }

  return response.json();
}

export const verifyPaymentFn = async (reference: number) => {
  const fullUrl = `${url}/payments/callback/${reference}`;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  return response.json();
}