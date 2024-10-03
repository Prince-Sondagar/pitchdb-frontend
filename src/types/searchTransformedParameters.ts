export interface ISearchTransformedParameters {
  keywords?: string;
  season?: string;
  type?: string;
  mediaType?: string;
  position?: string;
  genreIds?: string;
  language?: string;
  publishedBefore?: number | null;
  publishedAfter?: number | null;
  country?: string;
  state?: string;
  city?: string;
  resultsPerPage: number;
  offset: number;
  pagination?: string;
}
