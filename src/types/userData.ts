export interface IUserData {
  _id: string;
  email: string;
  name: string;
  signupEmail: string;
  privileges: string[];
  phone: string | null;
  network: string | null;
  signupNetwork: string | null;
  role: string | null;
  teamId: string | null;
  onboard: boolean | null;
  disabled: boolean | null;
  addedPrivileges: string[] | null;
  dateLastLogin: string | null;
  stripeCustomerId: string | null;
  detail: {
    _id: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    company: string | null;
    website: string | null;
    productOrService: string | null;
    featuredMedia: string[] | null;
    mediaKit: string[] | null;
    mediaProducts: string[] | null;
    reachoutContacts: string[] | null;
    isAuthor: string | null;
    publishHelp: string[] | null;
    submissionId: string | null;
  } | null;
}

export interface ICreatingUser {
  name?: string;
  email?: string;
  signupEmail?: string;
}
