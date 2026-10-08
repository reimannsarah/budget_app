import { useState, useEffect, useCallback } from "react";
import type { ResourceService } from "@/services/resource-service";

export function useResourceList<T extends { id: number }>(service: ResourceService<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await service.list();
      setData(items);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createItem = useCallback(
    async (values: Partial<T>) => {
      const created = await service.create(values);
      setData((prev) => [...prev, created]);
      return created;
    },
    [service]
  );

  const updateItem = useCallback(
    async (id: number, values: Partial<T>) => {
      const updated = await service.update(id, values);
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    },
    [service]
  );

  const deleteItem = useCallback(
    async (id: number) => {
      await service.remove(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    },
    [service]
  );

  return { data, isLoading, error, refetch, createItem, updateItem, deleteItem };
}
