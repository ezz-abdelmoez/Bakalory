import "server-only";

import { createServerApiClient } from "../../client/server-client";
import { unitsApi } from "./endpoint";
import type { UnitDto, UnitDetailDto } from "../../contracts/unit";

export async function listUnitsForServer(): Promise<UnitDto[]> {
  const client = await createServerApiClient("student");
  return unitsApi(client).list();
}

export async function getUnitForServer(idOrSlug: string): Promise<UnitDetailDto> {
  const client = await createServerApiClient("student");
  return unitsApi(client).get(idOrSlug);
}
