import type { ApiClient } from "../../transport/types";
import { homeContentSchema } from "../../schemas/home";
import type { HomeContentDto } from "../../contracts/home";

export const homeApi = (client: ApiClient) => ({
  content: () =>
    client.get<HomeContentDto>("/v1/home/content", {
      responseSchema: homeContentSchema,
    }),
});
