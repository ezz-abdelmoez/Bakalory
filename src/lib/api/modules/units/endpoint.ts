import { z } from "zod";
import type { ApiClient } from "../../transport/types";
import { unitSchema, unitDetailSchema } from "../../schemas/course";
import type { UnitDto, UnitDetailDto } from "../../contracts/unit";

export const unitsApi = (client: ApiClient) => ({
  list: () =>
    client.get<UnitDto[]>("/v1/units", { responseSchema: z.array(unitSchema) }),
  get: (idOrSlug: string) =>
    client.get<UnitDetailDto>(`/v1/units/${idOrSlug}`, {
      responseSchema: unitDetailSchema,
    }),
});
