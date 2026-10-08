import { apiFetch } from "./api-client";

export type ResourceService<T> = {
  list: () => Promise<T[]>;
  get: (id: number) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number, data: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
};

export function createResourceService<T extends { id: number }>(
  endpoint: string
): ResourceService<T> {
  return {
    list: () => apiFetch<T[]>(endpoint),
    get: (id) => apiFetch<T>(`${endpoint}${id}/`),
    create: (data) =>
      apiFetch<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiFetch<T>(`${endpoint}${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    remove: (id) =>
      apiFetch<void>(`${endpoint}${id}/`, { method: "DELETE" }),
  };
}
