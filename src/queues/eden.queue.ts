import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { CONFIG } from 'src/config/config';
import { Category } from 'src/models/category.model';
import { HighlightCategory } from 'src/models/higlight-category.model';
import { EdenService } from 'src/services/eden.service';
import { Repository } from 'typeorm';

@Processor(CONFIG.EDEN_QUEUE_NAME)
export class EdenQueueProcessor {
  @InjectRepository(Category) categoriesRepository: Repository<Category>;
  @InjectRepository(HighlightCategory)
  highlightCategoryRepository: Repository<HighlightCategory>;
  private readonly logger = new Logger(CONFIG.EDEN_QUEUE_NAME);

  @Process()
  async process(job: Job<{ text: string; highlightId: number }>) {
    this.logger.debug('Start send api to eden...');
    const { text, highlightId } = job.data;
    const { data } = await EdenService.namedEntity({ text });
    this.logger.debug('Start to save category');
    const categoryCandidates = data?.openai?.items || [];
    this.logger.debug('Process for ', categoryCandidates);
    for (const i of categoryCandidates) {
      const name = ((i?.category as string) || '').toLowerCase();
      let category = await this.categoriesRepository.findOneBy({
        name,
      });
      if (!category) {
        category = new Category();
        category.name = name;
        category = await this.categoriesRepository.save(category);
      }

      let higlightCategory = await this.highlightCategoryRepository.findOneBy({
        category_id: category.id,
        highlight_id: highlightId,
      });

      if (!higlightCategory) {
        higlightCategory = new HighlightCategory();
        higlightCategory.category_id = category.id;
        higlightCategory.highlight_id = highlightId;
        await this.highlightCategoryRepository.save(higlightCategory);
      }
    }
    this.logger.debug('Done.');
  }
}
