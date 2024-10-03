import { outreachSequenceStates } from '../constants';

export interface ILocation {
  city?: string;
  state?: string;
  country?: string;
}

interface INotes {
  title: string;
  content: string;
  date: string;
}

interface IStages {
  category: outreachSequenceStates; // This is a state or status, rather.
  date: string;
  content?: {
    subject: string;
    message: string;
    emailData?: {
      date: string;
    };
    recipient: string;
  };
}

export interface IOutreachSequence {
  emailFrom: string;
  notes: INotes;
  stages: IStages[];
}
