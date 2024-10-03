interface IPodcastObject {
  podcast: string;
  dateAdded: Date;
}

interface IEpisodeObject {
  episode: string;
  dateAdded: Date;
}

interface IEventsObject {
  event: string;
  dateAdded: Date;
}

interface IOrganizersObject {
  organizer: string;
  dateAdded: Date;
}

interface ISponsorsObject {
  sponsor: string;
  dateAdded: Date;
}

interface IGuestsObject {
  guest: string;
  dateAdded: Date;
}

export interface IUserContactList {
  _id: string;
  name: string;
  dateCreated: Date;
  podcasts?: IPodcastObject[] | null;
  episodes?: IEpisodeObject[] | null;
  events?: IEventsObject[] | null;
  organizers?: IOrganizersObject[] | null;
  sponsors?: ISponsorsObject[] | null;
  guests?: IGuestsObject[] | null;
}

export interface IListTag {
  listId: string;
  listName: string;
}
