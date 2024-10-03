import { useCallback, useEffect, useState } from 'react';
import { Divider, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getAllEpisodesById,
  getDetailByListenNotesId,
} from '../../../redux/searches/podcastsSearch';
import { formatDate } from '../../../utils';
import styles from '../Contacts.module.css';
import { podcastsSearchSelectors } from '../../../redux/searches/podcastsSearch/podcastSearch.selectors';
import { LoadingIcon } from '../../../common';

interface IPodcastEpisode {
  title: string;
  publishDate: string;
  description: string;
  duration: string;
  keywords: string[];
}

interface IProps {
  listenNotesId: string;
}

export function PodcastEpisodes({ listenNotesId }: IProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(podcastsSearchSelectors.isLoading);

  const [podcastEpisodes, setPodcastsEpisodes] = useState<IPodcastEpisode[]>([]);

  const getEpisodes = useCallback(
    async (listenNotesId: string) => {
      const podcastDetail = await dispatch(getDetailByListenNotesId(listenNotesId)).unwrap();

      if (podcastDetail?._id) {
        const episodes = await dispatch(getAllEpisodesById(podcastDetail._id)).unwrap();

        if (episodes.length) {
          setPodcastsEpisodes(episodes);
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    getEpisodes(listenNotesId);
  }, [getEpisodes, listenNotesId]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
        }}
      >
        <LoadingIcon />
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          Loading episodes
        </Typography>
      </div>
    );
  }

  if (!podcastEpisodes.length) {
    return <></>;
  }

  return (
    <>
      <Typography variant="body1" color="text.secondary" fontWeight="bold">
        Episodes
      </Typography>
      <div className={styles.episodesWrapper}>
        {podcastEpisodes.map((episode, index) => {
          return (
            <div key={index} className={styles.episodeWrapper}>
              <Typography variant="body1" color="text.primary">
                {episode.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published on {formatDate(episode.publishDate)}
              </Typography>
              <Divider sx={{ mt: '0.25rem ' }} />
              <Typography variant="body2" color="text.secondary" p="1rem">
                {episode.description}
              </Typography>
              <div className={styles.keywordsWrapper}>
                {episode.keywords.map((keyword, index) => {
                  return (
                    <div key={index} className={styles.keywordWrapper}>
                      <Typography variant="caption" color="text.primaryInverted" fontWeight="bold">
                        {keyword}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
