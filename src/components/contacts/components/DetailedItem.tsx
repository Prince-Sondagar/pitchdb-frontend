import { useCallback, useEffect, useState } from 'react';
import {
  IContactListItemDetail,
  IContactListItemDetailBaseInfo,
  deleteUserContactListItems,
  updateItemsPostRemoval,
} from '../../../redux/contactList';
import { Box, Button, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import StarRateIcon from '@mui/icons-material/StarRate';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import defaultImage from '../../../assets/logos/pitchdb-logo-short.png';
import { formatToTitleCase, convertToMarkdown, formatDate } from '../../../utils';
import { PodcastEpisodes } from '.';
import { contactCategories, outreachSequenceStates, socialNetworks } from '../../../constants';
import { ILocation, IOutreachSequence, IUserContactList } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getSequenceByContactId } from '../../../redux/outreachSequence';
import { getSequenceIcon } from './utils';
import styles from '../Contacts.module.css';
import { openDeleteConfirmation, successSideAlert } from '../../../redux/alerts';
import { emailSelectors } from '../../../redux/email';
import { useNavigate } from 'react-router-dom';

interface IProps {
  info: IContactListItemDetail;
  userContactLists: IUserContactList[];
  handleCloseDetails: () => void;
}

export function DetailedItem({ info, userContactLists, handleCloseDetails }: IProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userPrimaryEmailAccount = useAppSelector(emailSelectors.primaryEmailAccount);
  const isPodcast =
    info.baseInfo.category === contactCategories.podcast ||
    info.baseInfo.category === contactCategories.podcastEpisode;
  const isConnectedButInactive =
    info.baseInfo.pitched && !info.details?.connected && !info.details?.email;

  const listFound = userContactLists.find((list) => list._id === info.baseInfo.listId);

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    linkedin: '',
    instagram: '',
    chrunchBase: '',
  });
  const [outreachSequence, setOutreachSequence] = useState<IOutreachSequence | null>(null);

  const getSocialNetwork = useCallback((link: string) => {
    if (link.includes(socialNetworks.FACEBOOK)) {
      return socialNetworks.FACEBOOK;
    } else if (link.includes(socialNetworks.LINKEDIN)) {
      return socialNetworks.LINKEDIN;
    } else if (link.includes(socialNetworks.INSTAGRAM)) {
      return socialNetworks.INSTAGRAM;
    } else if (link.includes(socialNetworks.CHRUNCH_BASE)) {
      return socialNetworks.CHRUNCH_BASE;
    }
  }, []);

  const getOutreachSequenceInfo = useCallback(
    async (id: string) => {
      const outreachInfo = await dispatch(getSequenceByContactId(id)).unwrap();

      const { emailFrom, notes, stages } = outreachInfo;

      setOutreachSequence({
        emailFrom,
        notes,
        stages,
      });
    },
    [dispatch],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const setOfSocialLinks: string[] = [];

    info.details?.socialMediaLink1 && setOfSocialLinks.push(info.details.socialMediaLink1);
    info.details?.socialMediaLink2 && setOfSocialLinks.push(info.details.socialMediaLink2);
    info.details?.socialMediaLink3 && setOfSocialLinks.push(info.details.socialMediaLink3);

    setOfSocialLinks.map((link) => {
      const defined = getSocialNetwork(link);
      if (defined) {
        setSocialLinks((prev) => {
          return {
            ...prev,
            [defined]: link,
          };
        });
      }
    });

    getOutreachSequenceInfo(info.baseInfo.id);
  }, [getSocialNetwork, getOutreachSequenceInfo, info]);

  const formatLocation = (location: ILocation) => {
    const { city, state, country } = location;
    const constructingString: string[] = [];

    if (city) {
      constructingString.push(city);
    }
    if (state) {
      constructingString.push(state);
    }
    if (country) {
      constructingString.push(country);
    }

    return constructingString.join(', ');
  };

  const handleDeleteItem = async (item: IContactListItemDetailBaseInfo) => {
    const { listId, id, name } = item;

    const isConfirmed = await dispatch(
      openDeleteConfirmation({
        item: 'contact',
        message: `Are you sure you want to remove ${name}'s contact from the ${listFound?.name} list?`,
      }),
    ).unwrap();

    if (isConfirmed) {
      const result = await dispatch(
        deleteUserContactListItems({
          listId: listId,
          listItemIds: [id],
        }),
      ).unwrap();

      if (result?.deletedItemIds) {
        dispatch(updateItemsPostRemoval(result.deletedItemIds));
        dispatch(
          successSideAlert(
            `Contact${result.deletedItemIds.length > 1 ? 's' : ''} removed successfully`,
          ),
        );
        handleCloseDetails();
      }
    }
  };

  const findEmail = (item: IContactListItemDetail) => {
    console.log(item);
    // const itemSelector = `user${formatToTitleCase(item.baseInfo.category)}Id`;

    // const newSequence = {
    //   itemSelector: info.details?.id ?? '',
    //   listId: item.baseInfo.listId,
    //   listItemId: item.baseInfo.id,
    // };
  };

  const openEmail = (item: IContactListItemDetail) => {
    console.log(item);
  };

  const handlePitch = (item: IContactListItemDetail) => {
    if (item.baseInfo.pitched) {
      openEmail(item);
    } else {
      findEmail(item);
    }
  };

  const handleConfigurePrimaryEmail = () => {
    navigate('../configuration');
  };

  return (
    <>
      <div className={styles.goBackAndTitle}>
        <div>
          <Tooltip title="Go back" placement="right">
            <IconButton onClick={handleCloseDetails}>
              <ArrowBackIcon color="primary" fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={styles.detailsWrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.itemDetailedImageWrapper}>
            <img
              src={info.baseInfo.image ?? defaultImage}
              alt="Contact profile"
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
              width="100%"
              height="100%"
            />
          </div>
          <div className={styles.headerDetail}>
            <div>
              <div className={styles.titleAndTagWrapper}>
                <Typography variant="h4" color="text.primary">
                  {formatToTitleCase(info.baseInfo.name)}
                </Typography>
                <div className={styles.itemTag}>
                  <Typography variant="caption" color="text.primaryInverted" fontWeight="bold">
                    {listFound?.name}
                  </Typography>
                </div>
              </div>
              {info.baseInfo.email && (
                <Typography variant="body2" color="text.secondary">
                  {info.baseInfo.email}
                </Typography>
              )}
              {info.baseInfo.eventType && (
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                  {info.baseInfo.eventType}
                </Typography>
              )}
              {info.details?.foundedYear && (
                <Typography variant="body2" color="text.secondary">
                  Since {info.details.foundedYear}
                </Typography>
              )}
              {info.baseInfo.position && (
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                  {info.baseInfo.position}
                </Typography>
              )}
              {info.details?.magazineGenre && (
                <Typography variant="body2" color="text.secondary">
                  {info.details.magazineGenre}
                </Typography>
              )}
              {isPodcast && (
                <Typography variant="body2" color="text.secondary">
                  {info.baseInfo.category === 'podcast' ? 'Podcast' : 'Podcast episode'}
                </Typography>
              )}
              {info.details?.publisherName && (
                <Typography variant="body2" color="text.secondary">
                  By {info.details.publisherName}
                </Typography>
              )}
              {info.details?.rating && info.details?.rating.value >= 0 && (
                <div className={styles.ratingWrapper}>
                  <StarRateIcon
                    fontSize="small"
                    sx={(theme) => ({ color: theme.palette.primary.starYellow })}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {info.details.rating.value.toFixed(2)} | {info.details.rating.reviewsAmount}{' '}
                    review{info.details.rating.reviewsAmount > 1 ? 's' : ''}
                  </Typography>
                </div>
              )}
              {info.details?.businessName && (
                <Typography variant="body2" color="text.secondary">
                  {info.details.businessName}
                </Typography>
              )}
              <div className={styles.itemWebsite}>
                {info.details?.website && (
                  <>
                    <a href={info.details.website} target="_blank" rel="noopener">
                      {info.details.website}
                    </a>
                    <LinkIcon
                      fontSize="small"
                      sx={(theme) => ({ color: theme.palette.text.secondary })}
                    />
                  </>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener">
                    <FacebookIcon
                      sx={(theme) => ({ color: theme.palette.text.secondary, mt: '0.25rem' })}
                      fontSize="small"
                    />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener">
                    <InstagramIcon
                      sx={(theme) => ({ color: theme.palette.text.secondary, mt: '0.25rem' })}
                      fontSize="small"
                    />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener">
                    <LinkedInIcon
                      sx={(theme) => ({ color: theme.palette.text.secondary, mt: '0.25rem' })}
                      fontSize="small"
                    />
                  </a>
                )}
                {socialLinks.chrunchBase && (
                  <a href={socialLinks.chrunchBase} target="_blank" rel="noopener">
                    <DisplaySettingsIcon
                      sx={(theme) => ({ color: theme.palette.text.secondary, mt: '0.25rem' })}
                      fontSize="small"
                    />
                  </a>
                )}
              </div>
            </div>
            <div className={styles.buttonsWrapper}>
              <div className={styles.pitchButton}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ConnectWithoutContactIcon />}
                  onClick={() => handlePitch(info)}
                  disabled={isConnectedButInactive || !userPrimaryEmailAccount}
                >
                  {info.baseInfo.pitched ? 'Pitch again' : 'Pitch'}
                </Button>
                {isConnectedButInactive && (
                  <Typography variant="caption" color="error">
                    Sorry, no contact email.
                  </Typography>
                )}
                {!userPrimaryEmailAccount && (
                  <Typography variant="caption" color="error">
                    Configure your email account first.
                  </Typography>
                )}
                {}
              </div>
              <Divider
                orientation="vertical"
                flexItem
                style={{
                  borderWidth: '1px',
                  borderColor: '#fff',
                  marginLeft: '1rem',
                }}
              />
              <Tooltip title="Delete from contacts" placement="top">
                <IconButton onClick={() => handleDeleteItem(info.baseInfo)}>
                  <DeleteIcon color="error" fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className={styles.detailBodyWrapper}>
          <div className={styles.contactInfoWrapper}>
            <div className={styles.titleOnMiniModuleWrapper}>
              <Typography variant="h4" color="text.primary">
                Contact details
              </Typography>
            </div>
            <div className={styles.contactInfoBody}>
              {info.details?.contactName && (
                <Typography variant="body1" color="text.secondary">
                  <b>Contact name</b>
                  <br />
                  {`${info.details.contactName.firstName} ${
                    info.details.contactName.lastName ?? ''
                  }`}
                </Typography>
              )}
              {info.details?.estimatedAudience && (
                <Typography variant="body1" color="text.secondary">
                  <b>Estimated audience</b>
                  <br />
                  {info.details.estimatedAudience}
                </Typography>
              )}
              {info.details?.date && (
                <Typography variant="body1" color="text.secondary">
                  <b>Month</b>
                  <br />
                  {`${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
                    new Date(info.details.date),
                  )}`}
                </Typography>
              )}
              {info.details?.phoneNumber && (
                <Typography variant="body1" color="text.secondary">
                  <b>Phone number</b>
                  <br />
                  {info.details.phoneNumber}
                </Typography>
              )}
              {info.details?.eventAddress && (
                <Typography variant="body1" color="text.secondary">
                  <b>Event address</b>
                  <br />
                  {info.details.eventAddress.value}{' '}
                  {info.details.eventAddress.zipCode
                    ? `(ZIP ${info.details.eventAddress.zipCode})`
                    : ''}
                </Typography>
              )}
              {(info.details?.location?.city ||
                info.details?.location?.state ||
                info.details?.location?.country) && (
                <Typography variant="body1" color="text.secondary">
                  <b>Location</b>
                  <br />
                  {formatLocation(info.details.location)}
                </Typography>
              )}
              {info.details?.employeesRange && (
                <Typography variant="body1" color="text.secondary">
                  <b>Employees range</b>
                  <br />
                  {info.details.employeesRange}
                </Typography>
              )}
              {info.details?.sector && (
                <Typography variant="body1" color="text.secondary">
                  <b>Sector</b>
                  <br />
                  {info.details.sector}
                </Typography>
              )}
              {info.details?.industry && (
                <Typography variant="body1" color="text.secondary">
                  <b>Industry</b>
                  <br />
                  {info.details.industry}
                </Typography>
              )}
              {info.details?.budget && (
                <Typography variant="body1" color="text.secondary">
                  <b>Budget</b>
                  <br />${info.details.budget}
                </Typography>
              )}
              {!!info.details?.places?.length && (
                <>
                  <Typography variant="body1" color="text.secondary" fontWeight="bold">
                    Places
                  </Typography>
                  <br />
                  {info.details.places.map((place, index) => {
                    <Typography key={index} variant="body2" color="text.secondary">
                      - {place}
                    </Typography>;
                  })}
                </>
              )}
              {info.details?.equipment && (
                <Typography variant="body1" color="text.secondary">
                  <b>Equipment</b>
                  <br />
                  {info.details.equipment}
                </Typography>
              )}
              {info.details?.additionalInfo && (
                <Typography variant="body1" color="text.secondary">
                  <b>Additional info</b>
                  <br />
                  {info.details.additionalInfo}
                </Typography>
              )}
              {info.details?.optionalContactMethod && (
                <Typography variant="body1" color="text.secondary">
                  <b>Optional contact method</b>
                  <br />
                  {info.details.optionalContactMethod}
                </Typography>
              )}
              {!!info.details?.categories?.length && (
                <Typography variant="body1" color="text.secondary">
                  <b>Categories</b>
                  <br />
                  {info.details.categories.map((category) => category.label).join(' | ')}
                </Typography>
              )}
              {info.details?.subCategories && (
                <Typography variant="body1" color="text.secondary">
                  <b>Subcategories</b>
                  <br />
                  {info.details.subCategories}
                </Typography>
              )}
              {info.details?.description && (
                <Box sx={(theme) => ({ color: theme.palette.text.secondary })}>
                  <Typography variant="body1" color="text.secondary">
                    <b>Description</b>
                  </Typography>
                  <ReactMarkdown>{convertToMarkdown(info.details.description)}</ReactMarkdown>
                </Box>
              )}
              {info.details?.shortBio && (
                <Typography variant="body1" color="text.secondary">
                  <b>Short bio</b>
                  <br />
                  {info.details.shortBio}
                </Typography>
              )}
              {info.details?.topics && (
                <Typography variant="body1" color="text.secondary">
                  <b>Topics</b>
                  <br />
                  {info.details.topics}
                </Typography>
              )}
              {info.details?.detailedProfile && (
                <Typography variant="body1" color="text.secondary">
                  <b>Detailed profile</b>
                  <br />
                  {info.details.detailedProfile}
                </Typography>
              )}
              {info.details?.qualification && (
                <Typography variant="body1" color="text.secondary">
                  <b>Qualification</b>
                  <br />
                  {info.details.qualification}
                </Typography>
              )}
              {info.details?.audience && (
                <Typography variant="body1" color="text.secondary">
                  <b>Audience</b>
                  <br />
                  {info.details.audience}
                </Typography>
              )}
              {info.details?.promotionPlan && (
                <Typography variant="body1" color="text.secondary">
                  <b>Promotion plan</b>
                  <br />
                  {info.details.promotionPlan}
                </Typography>
              )}
              {info.details?.sampleQuestion && (
                <Typography variant="body1" color="text.secondary">
                  <b>Sample question</b>
                  <br />
                  {info.details.sampleQuestion}
                </Typography>
              )}
              {info.details?.ownPodcast && (
                <Typography variant="body1" color="text.secondary">
                  <b>Own podcast</b>
                  <br />
                  {info.details.ownPodcast}
                </Typography>
              )}
              {info.details?.audience && (
                <Typography variant="body1" color="text.secondary">
                  <b>Audience</b>
                  <br />
                  {info.details.audience}
                </Typography>
              )}
              {(info.details?.pastAppereance1 ||
                info.details?.pastAppereance2 ||
                info.details?.pastAppereance3) && (
                <>
                  <Typography variant="body1" color="text.primary">
                    <b>Past appereance</b>
                  </Typography>
                  {info.details?.pastAppereance1 && (
                    <Typography variant="body2" color="text.secondary" padding="0 1rem">
                      - {info.details?.pastAppereance1}
                    </Typography>
                  )}
                  {info.details?.pastAppereance2 && (
                    <Typography variant="body2" color="text.secondary" padding="0 1rem">
                      - {info.details?.pastAppereance2}
                    </Typography>
                  )}
                  {info.details?.pastAppereance3 && (
                    <Typography variant="body2" color="text.secondary" padding="0 1rem">
                      - {info.details?.pastAppereance3}
                    </Typography>
                  )}
                </>
              )}
              {info.baseInfo.category === 'podcast' && info.details?.listenNotesId && (
                <PodcastEpisodes listenNotesId={info.details.listenNotesId} />
              )}
            </div>
          </div>
          <div className={styles.emailSequenceWrapper}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfigurePrimaryEmail}
              size="large"
              sx={{ marginBottom: '1rem' }}
            >
              Configure email account
            </Button>
            <div className={styles.titleOnMiniModuleWrapper}>
              <Typography variant="h4" color="text.primary" alignSelf="center">
                Email sequence
              </Typography>
            </div>
            <div className={styles.contactInfoBody}>
              {!info.baseInfo.pitched ? (
                <Typography variant="body1" color="text.secondary">
                  Pitch the contact to start the outreach sequence
                </Typography>
              ) : (
                <>
                  {!!outreachSequence?.stages?.length &&
                    outreachSequence.stages.map((sequence, index) => {
                      return (
                        <div key={index} className={styles.sequenceWrapper}>
                          <div className={styles.sequenceHeader}>
                            {getSequenceIcon(sequence.category)}
                            <div>
                              <Typography variant="h3" color="text.secondary">
                                {formatToTitleCase(sequence.category)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                On {formatDate(sequence.date)}
                              </Typography>
                            </div>
                          </div>
                          {sequence.category === outreachSequenceStates.sent && (
                            <>
                              <Typography variant="body2" color="text.secondary">
                                <b>Subject</b>
                                <br />
                                {sequence.content?.subject}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <b>Message</b>
                                <br />
                                {sequence.content?.message}
                              </Typography>
                            </>
                          )}
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
