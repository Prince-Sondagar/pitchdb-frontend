import { type RootState } from '../store';

const isLoading = (state: RootState) => state.template.isLoading;
const emailTemplates = (state: RootState) => state.template.emailTemplates;

export const templateSelectors = { isLoading, emailTemplates };
