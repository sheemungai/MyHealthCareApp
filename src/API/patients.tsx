// API/patients.ts
import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";
import type { TPatient } from "@/Types/types";

export const getPatientsFn = async (page = 1, limit = 10, search = ''): Promise<{
  data: TPatient[];
  total: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search
  });

  const fullUrl = `${url}/patients?${params.toString()}`;
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

// API/patients.ts
export const createPatientFn = async (patientData: TPatient): Promise<TPatient> => {
  const fullUrl = `${url}/patients`;
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(patientData),
  });

 
  const data = await response.json();
  return data;
}



export const deletePatientFn = async (patientId: number): Promise<void> => {
  const fullUrl = `${url}/patients/${patientId}`;

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete patient');
  }
}

// API/patients.ts
export const getPatientsCount = async (): Promise<{ total: number }> => {
  const response = await fetch(`${url}/patients/count`, {
    headers: {
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });
  return response.json();
};