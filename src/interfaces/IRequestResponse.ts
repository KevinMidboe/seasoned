export interface Result {
  id: number;
  title: string;
  year: number;
  type: string;
  status: string;
  requested_date: Date;
}

export interface IRequestStatusResponse {
  success: boolean;
  message?: string;
  result?: Result;
}

export interface IRequestSubmitResponse {
  success: boolean;
  message: string;
}
