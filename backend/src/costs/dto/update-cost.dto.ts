import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { CostsCategories } from '../enums/costs-category.enum';

export class UpdateCostDto {
  @ApiProperty({
    example: 'salary',
    description: 'Income category',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Income category can't be empti` })
  @IsEnum(CostsCategories)
  readonly category_name?: CostsCategories;

  @ApiProperty({
    example: 'My cost',
    description: 'Cost name',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Cost name can't be empti` })
  readonly cost_name?: string;

  @ApiProperty({
    example: 142,
    description: 'Cost sum is integer number',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly cost_sum?: number;

  @ApiProperty({
    example: '2022-09-07T11:44:17.300Z',
    description: 'Cost create date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  readonly createdAt?: Date;
}
