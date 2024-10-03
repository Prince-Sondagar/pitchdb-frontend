export interface Genre {
  _id: string;
  label?: string;
  value?: string;
  parentId?: string;
}

export interface past_appereance {
  title?: string;
  id?: string;
}

export interface IProfileData {
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  businessname?: string;
  website?: string;
  socialMediaLink1?: string;
  socialMediaLink2?: string;
  socialMediaLink3?: string;
  Equipment?: string;
  additionalinfo?: string;
  optionalcontactmethod?: string;
  opportunities?: string[];
  searchGenres?: Genre[];
  shortbio?: string;
  topics?: string;
  detailedprofile?: string;
  qualification?: string;
  audience?: string;
  promotionPlan?: string;
  sampleQuestion?: string;
  ownpodcast?: string;
  past_appereance1?: past_appereance;
  past_appereance2?: past_appereance;
  past_appereance3?: past_appereance;
  podcasts?: boolean;
  free_speaking?: boolean;
  paid_speaking?: boolean;
  virtual?: boolean;
  conferences?: boolean;
  unPublishProfile?: boolean;

  connected?: boolean;
  teamId?: string;
}
