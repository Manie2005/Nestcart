import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { RegisterCategoryDto } from 'src/dto/register-category.dto';

@Controller('category')
export class CategoryController {
    constructor ( private readonly categoryService:CategoryService){}

    @Post()
    @HttpCode (HttpStatus.CREATED)
    async register(@Body()registerCategoryDto:RegisterCategoryDto){
        return this.categoryService.register(registerCategoryDto);
    }

}
