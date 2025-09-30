import { PrismaCategoryRepository } from "../../repositories/prisma/prisma-category-repository";
import { FetchCategoriesUseCase } from "../fetch-categories";

export function MakeFetchCategories() {
    const categoryRepository = new PrismaCategoryRepository();

    const useCase = new FetchCategoriesUseCase(categoryRepository);

    return useCase;
}