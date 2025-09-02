import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @Get('get-one/:platfroemId')
  findOneByPlatformId(
    @Headers('Uappi-Token') uappiToken: string,
    @Param('platfroemId') platfroemId: string,
  ) {
    return this.productsService.findOneByPlatformId(platfroemId, uappiToken);
  }

  @Get(':productUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('productUuid') productUuid: string) {
    return this.productsService.findOne(productUuid);
  }

  @Patch(':productUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('productUuid') productUuid: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(productUuid, updateProductDto);
  }

  @Delete(':productUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('productUuid') productUuid: string) {
    return this.productsService.remove(productUuid);
  }
}
