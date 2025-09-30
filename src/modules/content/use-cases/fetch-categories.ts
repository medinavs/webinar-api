import { Category } from "@prisma/client";
import { CategoryRepository } from "../repositories/category-repository";

interface FetchCategoriesResponse {
    categories: Category[];
}

export class FetchCategoriesUseCase {
    constructor(
        private categoryRepository: CategoryRepository,
    ) { }

    async execute(): Promise<FetchCategoriesResponse> {
        const categories = await this.categoryRepository.findAll();
        return { categories };
    }
}