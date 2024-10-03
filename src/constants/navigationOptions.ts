import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import EventIcon from '@mui/icons-material/Event';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CampaignIcon from '@mui/icons-material/Campaign';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';

export const navigationOptions = [
  {
    option: 'dashboard',
    title: 'Dashboard',
    icon: SpaceDashboardIcon,
  },
  {
    option: 'searches/podcast-search',
    title: 'Podcasts',
    icon: PodcastsIcon,
  },
  {
    option: 'searches/events-search',
    title: 'Local Associations',
    icon: EventIcon,
  },
  {
    option: 'searches/media-search',
    title: 'Media Outlets',
    icon: NewspaperIcon,
  },
  {
    option: 'searches/conference-search',
    title: 'Conferences',
    icon: CampaignIcon,
  },
  {
    option: 'searches/experts-search',
    title: 'Experts',
    icon: AccessibilityNewIcon,
  },
  {
    option: 'contacts',
    title: 'Contacts',
    icon: RecentActorsIcon,
  },
  {
    option: 'templates',
    title: 'Templates',
    icon: ArticleIcon,
  },
  {
    option: 'academy',
    title: 'Academy',
    icon: SchoolIcon,
  },
];
