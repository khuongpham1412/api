import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { Category } from 'src/models/category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getCategories(props: { user: User }) {
    const { user } = props;
    const categories = await this.categoriesRepository.findBy({
      highlightCategory: {
        highlight: {
          bookmark: {
            folder: {
              user_id: user.id,
            },
          },
        },
      },
    });
    return categories;
  }
}
