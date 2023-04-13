import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ICreateTableRo } from '@teable-group/core';
import { CreateFieldRo } from '../field/model/create-field.ro';
import { CreateRecordsRo } from '../record/create-records.ro';
import { CreateViewRo } from '../view/model/create-view.ro';

export class CreateTableRo implements ICreateTableRo {
  @ApiProperty({
    description: 'The name of the table.',
    example: 'table1',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'The description of the table.',
    example: 'my favorite songs',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The icon of the table.',
  })
  icon?: string;

  @ApiPropertyOptional({
    description:
      'The fields of the table. If it is empty, 3 fields include SingleLineText, Number, SingleSelect will be generated by default.',
    isArray: true,
    type: CreateFieldRo,
  })
  fields?: CreateFieldRo[];

  @ApiPropertyOptional({
    description:
      'The views of the table. If it is empty, a grid view will be generated by default.',
    isArray: true,
    type: CreateViewRo,
  })
  views?: CreateViewRo[];

  @ApiPropertyOptional({
    description:
      'The record data of the table. If it is empty, 3 empty records will be generated by default.',
    type: CreateRecordsRo,
  })
  rows?: CreateRecordsRo;
}