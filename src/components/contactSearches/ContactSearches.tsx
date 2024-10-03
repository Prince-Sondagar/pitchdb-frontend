import { Route, Routes } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PodcastsSearch from './podcastsSearch';
import EventsSearch from './eventsSearch';
import MediaOutletsSearch from './mediaOutletsSearch';
import ConferencesSearch from './conferencesSearch';
import SpeakersSearch from './speakersSearch';

export function ContactSearches() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        <Route path={'podcast-search'} element={<PodcastsSearch />} />
        <Route path={'events-search'} element={<EventsSearch />} />
        <Route path={'media-search'} element={<MediaOutletsSearch />} />
        <Route path={'conference-search'} element={<ConferencesSearch />} />
        <Route path={'experts-search'} element={<SpeakersSearch />} />
      </Routes>
    </LocalizationProvider>
  );
}
