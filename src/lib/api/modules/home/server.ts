import "server-only";

import { createServerApiClient } from "../../client/server-client";
import { homeApi } from "./endpoint";
import type { HomeContentDto } from "../../contracts/home";

export async function getHomeContentForServer(): Promise<HomeContentDto> {
  const client = await createServerApiClient("student");
  return homeApi(client).content();
}
