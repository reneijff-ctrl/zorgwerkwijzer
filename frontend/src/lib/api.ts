import { 
  SalaryCalculationRequest, 
  SalaryCalculationResponse, 
  OrtCalculationRequest, 
  OrtCalculationResponse,
  EndOfYearCalculationRequest,
  EndOfYearCalculationResponse,
  ApiError
} from "../types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    if (data && (data as ApiError).validationErrors) {
      const error = new Error((data as ApiError).message || "Validation failed") as Error & { validationErrors?: Record<string, string>, status?: number };
      error.validationErrors = (data as ApiError).validationErrors;
      error.status = response.status;
      throw error;
    }
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export async function calculateSalary(data: SalaryCalculationRequest): Promise<SalaryCalculationResponse> {
  const response = await fetch(`${API_BASE_URL}/salary/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<SalaryCalculationResponse>(response);
}

export async function calculateOrt(data: OrtCalculationRequest): Promise<OrtCalculationResponse> {
  const response = await fetch(`${API_BASE_URL}/ort/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<OrtCalculationResponse>(response);
}

export async function calculateEndOfYearBonus(data: EndOfYearCalculationRequest): Promise<EndOfYearCalculationResponse> {
  const response = await fetch(`${API_BASE_URL}/salary/calculate-end-of-year`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<EndOfYearCalculationResponse>(response);
}
