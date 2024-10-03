export interface ISelectInputOption {
  _id?: string;
  parentId?: string;
  refId?: string;
  label: string;
  value: string;
}

export interface ISelectInputOptionNumeric {
  _id?: string;
  parentId?: string;
  label: string;
  value: number;
}
