import type { CellFormat, FieldKeyType } from './record';

export interface IRecord {
  id: string;
  fields: IRecordFields;
  createdTime?: number;
  lastModifiedTime?: number;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface IRecordFields {
  [fieldId: string]: unknown;
}

export interface IRecordSnapshot {
  record: IRecord;
  recordOrder: { [viewId: string]: number };
}

export interface ICreateRecordsRo {
  fieldKeyType?: FieldKeyType;

  records: {
    fields: { [fieldIdOrName: string]: unknown };
  }[];
}

export interface IUpdateRecordRo {
  fieldKeyType?: FieldKeyType;

  record: {
    fields: { [fieldIdOrName: string]: unknown };
  };
}

export interface IUpdateRecordByIndexRo extends IUpdateRecordRo {
  viewId: string;
  index: number;
}

export interface IRecordVo {
  record: IRecord;
}

export interface IRecordsVo {
  records: IRecord[];

  total: number;
}

export interface IRecordsRo {
  take?: number;

  skip?: number;

  recordIds?: string[];

  viewId?: string;

  projection?: string[];

  cellFormat?: CellFormat;

  fieldKey?: FieldKeyType;
}
