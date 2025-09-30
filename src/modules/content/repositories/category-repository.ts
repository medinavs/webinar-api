import { Category } from "@prisma/client";

export interface CategoryRepository {
    findAll(): Promise<Category[]>;
}