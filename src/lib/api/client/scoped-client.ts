import { createBrowserApiClient } from "./browser-client";
import { homeApi } from "../modules/home/endpoint";
import { unitsApi } from "../modules/units/endpoint";
import { lessonsApi } from "../modules/lessons/endpoint";
import { quizApi } from "../modules/quiz/endpoint";

/**
 * The single client-side entry point for the "student" surface. UI hooks must
 * only ever fetch through this object — never through fetch or fixtures.
 */
const studentClient = createBrowserApiClient("student");

export const studentApi = {
  home: homeApi(studentClient),
  units: unitsApi(studentClient),
  lessons: lessonsApi(studentClient),
  quiz: quizApi(studentClient),
};
