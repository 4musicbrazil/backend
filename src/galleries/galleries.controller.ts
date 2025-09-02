import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('Galleries')
@ApiBearerAuth()
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createGalleryDto);
    return this.galleriesService.create(file, createGalleryDto);
  }

  @Patch(':uuid')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('uuid') uuid: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.galleriesService.update(uuid, file, updateGalleryDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.galleriesService.findAll(type, search, +skip, +take);
  }

  @Get(':gallerieUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('gallerieUuid') gallerieUuid: string) {
    return this.galleriesService.findOne(gallerieUuid);
  }

  @Delete(':gallerieUuid')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('gallerieUuid') gallerieUuid: string) {
    return this.galleriesService.remove(gallerieUuid);
  }
}
