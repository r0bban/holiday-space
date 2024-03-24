export type SalaryRequest = {
  grossSalary: number;
  table: number;
  year?: number;
  companyCar?: CompanyCarInput;
};

export type CompanyCarInput = {
  grossDeduction?: number;
  grossDeductionPct?: number;
  leasingFee?: number;
  taxableBenefit?: number;
};

export type NetSalaryResponse = {
  grossSalary: number;
  tax: number;
  netSalary: number;
  withCar?: WithCar;
};

export type WithCar = {
  totalGrossDeduction: number;
  taxableIncome: number;
  tax: number;
  netSalary: number;
  totalNetCost: number;
};
