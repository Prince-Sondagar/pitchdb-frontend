import { IUserData } from '.';

export interface IEmail {
  _id?: string;
  subject: string;
  content: string;
  date: Date;
  id?: string;
  editDate?: Date;
}

export interface ITemplate {
  _id: string;
  userId: string;
  emailtemplate: IEmail[];
}

export interface IAddEmailTemplate {
  userId: string;
  template: IEmail;
}

export interface IEditEmailTemplate {
  templateId: string;
  template: IEmail;
  userId?: string;
}

export interface IEmailData {
  emaiAccountdata?: IUserData;
  emailval: string;
  message: string;
  subject: string;
}

export interface ISendEmail {
  emailData: IEmailData;
}

export interface IEmailAccount {
  _id: string;
  activationDate: string;
  date: string;
  email: string;
  network: string;
  userId: string;
}

export interface ICheckboxesDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface IEmailAccountConfiguration {
  id?: string;
  userId: string;
  selectedDays: ICheckboxesDays;
  startTime: Date;
  endTime: Date;
  timeZone: string;
}
