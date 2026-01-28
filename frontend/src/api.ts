export type JobStatus = "queued" | "started" | "finished" | "failed" | "idle";

export type JobResponse = {
  job_id: string;
  status: JobStatus;
  result: any | null;
  error: string | null;
};

export type ResultsResponse = {
  total: number;
  page: number;
  page_size: number;
  rows: any[];
  columns?: string[];
};

export async function startCompare(form: FormData) {
  const res = await fetch("/api/compare", { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJob(jobId: string): Promise<JobResponse> {
  const res = await fetch(`/api/jobs/${jobId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getResults(jobId: string, page: number, pageSize: number): Promise<ResultsResponse> {
  const res = await fetch(`/api/jobs/${jobId}/results?page=${page}&page_size=${pageSize}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function downloadUrl(jobId: string) {
  return `/api/jobs/${jobId}/download`;
}
