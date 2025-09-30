import { Category } from "@prisma/client";
import { CategoryRepository } from "../category-repository";
import { prisma } from "@/infrastructure/database/client";

export class PrismaCategoryRepository implements CategoryRepository {
    async findAll(): Promise<Category[]> {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return categories;
    }
}