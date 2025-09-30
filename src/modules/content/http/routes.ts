import { CategoryController } from "./controllers/category-controller";
import { WebinarController } from "./controllers/webinar-controller";

export const routes = [
    new WebinarController(),
    new CategoryController()
]