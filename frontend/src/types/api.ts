export interface SalaryCalculationRequest {
  hourlySalary: number;
  weeklyHours: number;
}

export interface SalaryCalculationResponse {
  monthlyGrossSalary: number;
  yearlyGrossSalary: number;
  holidayAllowance: number;
  endOfYearBonus: number;
}

export interface OrtCalculationRequest {
  eveningHours: number;
  nightHours: number;
  saturdayHours: number;
  sundayHours: number;
  holidayHours: number;
  hourlyWage: number;
}

export interface OrtCalculationResponse {
  eveningAllowance: number;
  nightAllowance: number;
  saturdayAllowance: number;
  sundayAllowance: number;
  holidayAllowance: number;
  totalOrt: number;
}

export interface HealthResponse {
  status: string;
  application: string;
  version: string;
}

export interface EndOfYearCalculationRequest {
  monthlyGrossSalary: number;
  weeklyHours: number;
  fulltimeHours: number;
  monthsWorked: number;
  averageMonthlyOrt: number;
  includeOrt: boolean;
}

export interface EndOfYearCalculationResponse {
  totalBonus: number;
  monthlyAccrual: number;
  percentage: number;
  calculationBasis: number;
  ortContribution: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}
