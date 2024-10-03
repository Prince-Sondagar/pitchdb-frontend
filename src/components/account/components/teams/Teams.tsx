import { Button, Divider, TextField, Typography } from '@mui/material';
import styles from '../../Account.module.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { createTeam, getTeam, sendInvitation, teamsSelectors } from '../../../../redux/teams';
import { roles } from '../../../../constants';
import { userSelectors } from '../../../../redux/user';

const team = {};

export const Teams = () => {
  const dispatch = useAppDispatch();

  const userData = useAppSelector(userSelectors.userData);
  const teamData = useAppSelector(teamsSelectors.team);
  const users = useAppSelector(teamsSelectors.users);

  const [emailInvitation, setEmailInvitation] = useState('');

  useEffect(() => {
    if (userData?.teamId) dispatch(getTeam(userData?.teamId));
  }, []);

  const handleEmailInvitation = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEmailInvitation(event.target.value);
  };

  const handleCreateTeam = () => {
    dispatch(createTeam());
  };

  const handleSendInvitation = () => {
    if (teamData && emailInvitation) {
      const params = {
        team: teamData,
        invEmail: emailInvitation,
      };

      dispatch(sendInvitation(params));
    }
  };

  const signinMember = () => {
    //recibe un index
  };

  const removeMember = () => {
    //recibe un index
  };

  return (
    <div className={`${styles.content}`}>
      <div className={`${styles.contentWrapper}`} style={{ margin: '2rem 0' }}>
        <Typography variant="h3">Team</Typography>

        {!userData?.teamId ? (
          <>
            <Typography variant="body1">
              {' '}
              You don't have a team yet, create it and start inviting members.{' '}
            </Typography>
            <Button
              variant="contained"
              sx={{ width: '20vh', fontWeight: '600' }}
              onClick={handleCreateTeam}
            >
              {' '}
              Create team{' '}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1"> Invite new members to your team </Typography>
            <div className={`${styles.horizontalWrapper}`}>
              <TextField
                label="Email Invitation"
                type="email"
                placeholder="someone@email.com"
                onChange={handleEmailInvitation}
                value={emailInvitation}
                sx={{ width: '40vh' }}
              />
              <Button variant="contained" sx={{ fontWeight: '600' }} onClick={handleSendInvitation}>
                Send invitation
              </Button>
            </div>

            {team ? (
              <>
                {users?.map((currentUser, index) => {
                  return (
                    <div key={index}>
                      <Divider />
                      <div className={`${styles.usersWrapper}`}>
                        <Typography fontWeight={600}>
                          {' '}
                          {currentUser.name +
                            (currentUser.email === userData?.email ? ' (me)' : '')}{' '}
                        </Typography>
                        <Typography fontWeight={600}> {userData?.email} </Typography>
                        <Typography fontWeight={600}> {userData?.role} </Typography>
                      </div>

                      {userData?.role === roles.admin && currentUser.email !== userData?.email && (
                        <div
                          className={`${styles.horizontalWrapper}`}
                          style={{ margin: '0rem 2rem 2rem 0rem' }}
                        >
                          <Button
                            variant="contained"
                            onClick={signinMember}
                            sx={{ width: '20vh', fontWeight: '600' }}
                          >
                            {' '}
                            Account Sign in{' '}
                          </Button>
                          <Button
                            variant="contained"
                            onClick={removeMember}
                            sx={{ width: '20vh', fontWeight: '600' }}
                          >
                            {' '}
                            Remove member{' '}
                          </Button>
                        </div>
                      )}

                      <Divider />
                    </div>
                  );
                })}
              </>
            ) : (
              ''
            )}
          </>
        )}
      </div>
    </div>
  );
};
