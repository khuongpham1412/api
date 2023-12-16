import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { CategoryService } from 'src/services/category.service';
import { HttpResponse } from 'src/utils/http-response';
import { Serialize } from 'src/utils/serialize';

@UseGuards(AuthGuard)
@Controller('/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategories(@Req() req: AuthenticatedRequest) {
    const categories = await this.categoryService.getCategories({
      user: req.user,
    });
    return new HttpResponse({
      data: {
        categories: await Promise.all(
          categories.map((category) => Serialize.category({ category })),
        ),
      },
    });
  }
}
