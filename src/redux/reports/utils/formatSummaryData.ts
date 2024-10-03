export interface IResultsObject {
  name: string;
  y: number;
}

export const formatSummaryData = (rawData: any) => {
  if (!rawData.length) {
    return [];
  }

  const formattedSummary: IResultsObject[] = [];

  rawData.map((raw: any) => {
    if (raw._id && raw.value) {
      formattedSummary.push({ name: raw._id, y: raw.value });
    }
  });

  return formattedSummary;
};
