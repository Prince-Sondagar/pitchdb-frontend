import {
  Button,
  Chip,
  IconButton,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, useEffect, useState } from 'react';
import { monthlyOptions } from '../../../../constants/calendar';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  addAdminasSignTemplate,
  addCredits,
  addPrivilege,
  adminSelectors,
  countUsers,
  createUser,
  deleteUser,
  getAllUsers,
  getPrivilegeList,
  getSignInToken,
  removePrivilege,
  resetPassword,
  toggleStatus,
} from '../../../../redux/admin';
import { ICreatingUser, ISubscriptionPlan, ITemplate, IUserData } from '../../../../types';
import {
  addSubscriptionPlanToStripe,
  addUserSubscriptionPlan,
  getStripeSubscriptionPlansData,
  subscriptionSelectors,
} from '../../../../redux/subscription';
import Switch from '@mui/material/Switch';
import {
  closeLoadingModal,
  openConfirmation,
  openDeleteConfirmation,
  openLoadingModal,
} from '../../../../redux/alerts';
import { getAllTemplates, templateSelectors } from '../../../../redux/template';
import Pagination from '@mui/material/Pagination';
import { setAdminJWT } from '../../../../redux/cookies';
import { getUserData } from '../../../../redux/user';
import styles from '../../Account.module.css';

interface IPlan {
  planName?: string;
  planPrice?: number;
  planCredits?: number;
}

export const UsersSuperAdmin = () => {
  const dispatch = useAppDispatch();

  const usersData = useAppSelector(adminSelectors.users);
  const privilegeList = useAppSelector(adminSelectors.userPrivileges);
  const templates = useAppSelector(templateSelectors.emailTemplates);
  const subscriptionsPlanList = useAppSelector(subscriptionSelectors.subscriptionPlans);
  const usersAmount = useAppSelector(adminSelectors.usersAmount);
  const pageSize = useAppSelector(adminSelectors.pageSize);

  const [searchValue, setSearchValue] = useState('');
  const [currentUser, setCurrentUser] = useState<IUserData | null>(null);
  const [newUser, setNewUser] = useState<ICreatingUser | null>(null);
  const [newPlan, setNewPlan] = useState<IPlan | null>({
    planName: '',
    planPrice: 0,
    planCredits: 0,
  });

  const [createUserMode, setCreateUserMode] = useState(false);
  const [createPlanMode, setCreatePlanMode] = useState(false);
  const [intervalSelect, setIntervalSelect] = useState(monthlyOptions[0].value);

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [adminButtonsIsVisible, setAdminButtonsIsVisible] = useState(true);
  const [addCreditsIsVisible, setAddCreditsIsVisible] = useState(false);
  const [changePrivilegesIsVisible, setChangePrivilegesIsVisible] = useState(false);
  const [recurringSelectIsVisible, setRecurringSelectIsVisible] = useState(false);
  const [currentUserIsDisabled, setCurrentUserIsDisabled] = useState<boolean | null>(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newCredits, setNewCredits] = useState('');
  const [currentPrivilegeListToAdd, setCurrentPrivilegeListToAdd] = useState<string[]>([]);
  const [currentPrivilegeListToRemove, setCurrentPrivilegeListToRemove] = useState<string[]>([]);
  const [privilegeToAdd, setPrivilegeToAdd] = useState('');
  const [privilegeToRemove, setPrivilegeToRemove] = useState('');
  const [subscriptionPlanSelected, setSubscriptionPlanSelected] =
    useState<ISubscriptionPlan | null>();
  const [templateSelected, setTemplateSelected] = useState<ITemplate | null>();

  useEffect(() => {
    dispatch(getAllUsers({ page: page }));
    dispatch(countUsers(null));
    dispatch(getPrivilegeList());
    dispatch(getStripeSubscriptionPlansData());
    dispatch(getAllTemplates());
  }, []);

  useEffect(() => {
    if (subscriptionsPlanList) setSubscriptionPlanSelected(subscriptionsPlanList[0]);
  }, [subscriptionsPlanList]);

  useEffect(() => {
    if (templates) setTemplateSelected(templates[0]);
  }, [templates]);

  useEffect(() => {
    //to update the list of privileges to remove
    if (currentUser) {
      setCurrentPrivilegeListToRemove(currentUser?.privileges);
      setCurrentUserIsDisabled(currentUser.disabled);
    }

    resetToggles();
  }, [currentUser]);

  useEffect(() => {
    setNewCredits('');
  }, [addCreditsIsVisible]);

  useEffect(() => {
    const pageToSearch = Number(page - 1);
    dispatch(getAllUsers({ page: pageToSearch }));
  }, [page]);

  useEffect(() => {
    if (usersAmount) setTotalPages(Math.ceil(Number(usersAmount) / pageSize) - 1);
  }, [usersAmount]);

  useEffect(() => {
    if (privilegeList) {
      setCurrentPrivilegeListToAdd(privilegeList);
      setPrivilegeToAdd(privilegeList[0]);
    }
  }, [privilegeList]);

  useEffect(() => {
    //when a user deletes a privilege from the user, the privilegeListToAdd, resets with all the privileges except the ones that are in the current user
    if (privilegeList) {
      setCurrentPrivilegeListToAdd(
        privilegeList.filter((privilege) => !currentPrivilegeListToRemove.includes(privilege)),
      );
    }

    if (currentPrivilegeListToRemove[0]) setPrivilegeToRemove(currentPrivilegeListToRemove[0]);
  }, [currentPrivilegeListToRemove]);

  useEffect(() => {
    setPrivilegeToAdd(currentPrivilegeListToAdd[0]);
  }, [currentPrivilegeListToAdd]);

  const resetToggles = () => {
    if (changePrivilegesIsVisible) toggleChangePrivilesIsVisible();

    if (addCreditsIsVisible) toggleAddCreditsIsVisible();

    if (recurringSelectIsVisible) toggleRecurringSelectIsVisible();

    if (templates) setTemplateSelected(templates[0]);
  };

  const handleOnChangePage = (_e: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecurringSelectIsVisible(event.target.checked);
  };

  const toggleChangeIsDetailVisible = () => {
    setIsDetailVisible(!isDetailVisible);
  };

  const toggleAdminButtonsIsVisible = () => {
    setAdminButtonsIsVisible(!adminButtonsIsVisible);
  };

  const toggleCreateUserMode = () => {
    createUserMode == true ? setNewUser(null) : true;

    setCreateUserMode(!createUserMode);
  };

  const toggleCreatePlanMode = () => {
    setCreatePlanMode(!createPlanMode);

    createPlanMode == true ? setNewPlan(null) : true;
  };

  const toggleChangePrivilesIsVisible = () => {
    toggleAdminButtonsIsVisible();
    setPrivilegeToAdd(privilegeList && privilegeList?.length > 0 ? privilegeList[0] : '');
    setPrivilegeToRemove(
      currentUser && currentUser.privileges?.length > 0 ? currentUser.privileges[0] : '',
    );
    setChangePrivilegesIsVisible(!changePrivilegesIsVisible);
  };

  const toggleRecurringSelectIsVisible = () => {
    setRecurringSelectIsVisible(!recurringSelectIsVisible);
  };

  const handleViewUserDetails = (user: IUserData) => {
    setCurrentUser(user);

    if (!isDetailVisible) toggleChangeIsDetailVisible();
  };

  //add credits button
  const toggleAddCreditsIsVisible = () => {
    toggleAdminButtonsIsVisible();
    setAddCreditsIsVisible(!addCreditsIsVisible);
  };

  const handleAddCredits = () => {
    if (currentUser) {
      const props = {
        userId: currentUser?._id,
        amount: newCredits,
      };

      dispatch(addCredits(props));
      toggleAddCreditsIsVisible();
    }
  };

  const handleOnChangeNewAddCredits = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNewCredits(event.target.value);
  };

  const handleOnChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchValue(event.target.value);
  };

  const handleOnChangeNewUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.name == 'email') {
      setNewUser((prev) => {
        return {
          ...(prev ?? undefined),
          email: event.target.value,
          signupEmail: event.target.value,
        };
      });
    } else {
      setNewUser((prev) => {
        return {
          ...(prev ?? undefined),
          [event.target.name]: event.target.value,
        };
      });
    }
  };

  const handleOnChangeNewPlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNewPlan((prev) => {
      return {
        ...(prev ?? undefined),
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleOnChangeIntervalSelect = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    setIntervalSelect(event.target.value);
  };

  const handleOnChangeTemplateSelected = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    setTemplateSelected(
      templates.find((template) => template.emailtemplate[0]._id === event.target.value),
    );
  };

  const handleOnChangePlanSelected = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    setSubscriptionPlanSelected(
      subscriptionsPlanList?.find((plan) => plan.id === event.target.value),
    );
  };

  const handleOnChangeNewPrivilegeSelect = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    setPrivilegeToAdd(event.target.value);
  };

  const handleOnChangePrivilegeToRemoveSelect = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    setPrivilegeToRemove(event.target.value);
  };

  const handleAssingTemplate = async () => {
    if (currentUser) {
      const confirm = await dispatch(
        openConfirmation({
          title: 'Add Template',
          message: 'Do you want to add that template to the user?',
        }),
      ).unwrap();

      if (confirm && templateSelected?.emailtemplate[0]._id) {
        const props = {
          userId: currentUser?._id,
          templateid: templateSelected?.emailtemplate[0]._id,
        };
        dispatch(addAdminasSignTemplate(props));
      }
    }
  };

  const handleChangePlan = async () => {
    if (currentUser) {
      const confirm = await dispatch(
        openConfirmation({
          title: 'Add Recurring Plan',
          message: 'Do you want to add that plan to the user?',
        }),
      ).unwrap();

      if (
        confirm &&
        currentUser.stripeCustomerId &&
        subscriptionPlanSelected &&
        subscriptionPlanSelected.id
      ) {
        const params = {
          userId: currentUser._id,
          planId: subscriptionPlanSelected.id,
          email: currentUser.email,
          name: currentUser.name,
          stripeId: currentUser.stripeCustomerId,
        };

        dispatch(addUserSubscriptionPlan(params));
      }
    }
  };

  const handleCreateUserAccount = () => {
    //dispatch createPlan
    if (newUser != null) {
      dispatch(createUser(newUser));
    }

    //toggle false createUserMode
    toggleCreateUserMode();
  };

  const handleCreateStripePlan = () => {
    if (newPlan != null) {
      const price = newPlan?.planPrice ? newPlan.planPrice * 100 : 0;
      const credit = newPlan?.planCredits ? newPlan.planCredits : 0;
      const intervals = intervalSelect;
      let final_inerval = 'month';
      let interval_counts = 1;
      if (intervals === 'month') {
        final_inerval = 'month';
        interval_counts = 1;
      } else if (intervals === 'quarterly') {
        final_inerval = 'month';
        interval_counts = 3;
      } else if (intervals === 'year') {
        final_inerval = 'month';
        interval_counts = 12;
      }

      const requestBody = {
        interval: final_inerval,
        interval_count: interval_counts,
        currency: 'usd',
        amount: price,
        'product[name]': newPlan?.planName ?? '',
        nickname: newPlan?.planName ?? '',
        'metadata[app_credits]': credit,
        'metadata[app_name]': newPlan?.planName ?? '',
      };

      dispatch(addSubscriptionPlanToStripe(requestBody));
    }

    //toggle false createUserMode
    toggleCreatePlanMode();
  };

  const handleResetPassword = async () => {
    if (currentUser) {
      const confirm = await dispatch(
        openConfirmation({ title: 'Reset Password', message: "Reset this user's password?" }),
      ).unwrap();

      if (confirm) {
        dispatch(resetPassword(currentUser._id));
      }
    }
  };

  const handleRemoveUser = async () => {
    if (currentUser) {
      const confirm = await dispatch(
        openDeleteConfirmation({
          item: 'user',
          message: 'Once removed, you will not be able to recover this user',
        }),
      ).unwrap();

      if (confirm) {
        dispatch(deleteUser(currentUser._id));
      }
    }
  };

  const handleDisableUser = async () => {
    if (currentUser) {
      let confirm = false;

      if (currentUser.disabled) {
        confirm = await dispatch(
          openConfirmation({
            title: 'Enable',
            message: 'Are you sure you want to ENABLE this user?',
          }),
        ).unwrap();
      } else {
        confirm = await dispatch(
          openConfirmation({
            title: 'Disable',
            message: 'Are you sure you want to DISABLE this user?',
          }),
        ).unwrap();
      }

      if (confirm) {
        const result = await dispatch(toggleStatus(currentUser._id));

        if (result && result.meta.requestStatus === 'fulfilled') {
          setCurrentUserIsDisabled(!currentUserIsDisabled);
        }
      }
    }
  };

  //NOT FINISHED YET
  const handleSignInAsUser = async () => {
    if (currentUser) {
      const confirm = await dispatch(
        openConfirmation({ title: 'Confirm', message: 'Sign into this user account?' }),
      ).unwrap();

      if (confirm) {
        dispatch(openLoadingModal('Authenticating'));

        const token = await dispatch(getSignInToken(currentUser._id)).unwrap();

        //to delete
        console.log('handleSignInAsUser token ', token);

        if (token) {
          dispatch(setAdminJWT(token));
          dispatch(closeLoadingModal());
          await dispatch(getUserData());
          window.location.reload();
        }
      }
    }
  };

  //AQUI handle Remove
  const handleRemovePrivileges = async () => {
    if (currentUser && privilegeToRemove !== '') {
      const confirm = await dispatch(
        openConfirmation({
          title: 'Confirm',
          message: 'Do you want to remove this privilege for this user?',
        }),
      ).unwrap();

      if (confirm != null && confirm == true) {
        const props = {
          userId: currentUser._id,
          privilege: privilegeToRemove,
        };

        const result = await dispatch(removePrivilege(props));

        if (result && result.meta.requestStatus === 'fulfilled' && privilegeList) {
          setCurrentPrivilegeListToRemove(
            currentPrivilegeListToRemove.filter((privilege) => privilege !== privilegeToRemove),
          );
        }
        toggleChangePrivilesIsVisible();
      }
    }
  };

  const handleAddPrivileges = async () => {
    if (currentUser && privilegeToAdd !== '') {
      const confirm = await dispatch(
        openConfirmation({
          title: 'Confirm',
          message: 'Do you want to add this privilege for this user?',
        }),
      ).unwrap();

      if (confirm != null && confirm == true) {
        const props = {
          userId: currentUser._id,
          privilege: privilegeToAdd,
        };

        const result = await dispatch(addPrivilege(props));

        if (result && result.meta.requestStatus === 'fulfilled' && privilegeToAdd) {
          setCurrentPrivilegeListToRemove((privileges) => [...privileges, privilegeToAdd]);
        }

        toggleChangePrivilesIsVisible();
      }
    }
  };

  return (
    <div className={`${styles.content}`}>
      <div className={`${styles.contentWrapper}`} style={{ margin: '2rem 0rem 0rem 0rem' }}>
        <Typography variant="h3">Team</Typography>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={`${styles.horizontalWrapper}`}>
            <Button
              variant="contained"
              onClick={toggleCreateUserMode}
              sx={{ width: 'auto', fontWeight: '600' }}
            >
              {' '}
              + Create user account{' '}
            </Button>
            <Button
              variant="contained"
              onClick={toggleCreatePlanMode}
              sx={{ width: 'auto', fontWeight: '600' }}
            >
              {' '}
              + Create Stripe Plan{' '}
            </Button>
          </div>
        </div>

        <div className={`${styles.horizontalWrapper}`}>
          <TextField
            label="Search by name or email"
            onChange={handleOnChangeSearch}
            value={searchValue}
            sx={{ width: '60vh' }}
          />
          <Button
            variant="contained"
            sx={{ fontWeight: '600' }}
            onClick={() => console.log('search')}
          >
            Search
          </Button>
        </div>

        {createUserMode && (
          <div className={`${styles.horizontalWrapper}`}>
            <TextField
              type="email"
              name="email"
              placeholder="someone@email.com"
              onChange={handleOnChangeNewUser}
              value={newUser?.email || ''}
              sx={{ width: '30vh' }}
            />
            <TextField
              label="Name"
              name="name"
              onChange={handleOnChangeNewUser}
              value={newUser?.name || ''}
              sx={{ width: '30vh' }}
            />
            <IconButton aria-label="check" onClick={handleCreateUserAccount}>
              <CheckIcon />
            </IconButton>
            <IconButton aria-label="check" onClick={toggleCreateUserMode}>
              <CloseIcon />
            </IconButton>
          </div>
        )}
        {createPlanMode && (
          <div className={`${styles.horizontalWrapper}`}>
            <TextField
              label="Plan Name"
              name="planName"
              onChange={handleOnChangeNewPlan}
              value={newPlan?.planName || ''}
              sx={{ width: '20vh' }}
            />
            <TextField
              type="number"
              label="Plan Price"
              name="planPrice"
              onChange={handleOnChangeNewPlan}
              value={newPlan?.planPrice || 0}
              sx={{ width: '20vh' }}
            />
            <TextField
              type="number"
              label="Plan Credits"
              name="planCredits"
              onChange={handleOnChangeNewPlan}
              value={newPlan?.planCredits || 0}
              sx={{ width: '20vh' }}
            />
            <Select value={intervalSelect} onChange={handleOnChangeIntervalSelect}>
              {monthlyOptions.map((_, index) => (
                <MenuItem key={index} value={monthlyOptions[index].value}>
                  {monthlyOptions[index].label}
                </MenuItem>
              ))}
            </Select>
            <IconButton aria-label="check" onClick={handleCreateStripePlan}>
              <CheckIcon />
            </IconButton>
            <IconButton aria-label="cancel" onClick={toggleCreatePlanMode}>
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </div>

      <div className={`${styles.horizontalWrapper}`}>
        <div
          className={`${styles.visibilityWrapper}`}
          style={{ margin: '2rem 0rem', width: '40%' }}
        >
          <div className={`${styles.adminUsersListWrapper}`}>
            {usersData &&
              usersData.map((user: IUserData, index) => {
                return (
                  <div key={index} className={`${styles.adminUsersWrapper}`}>
                    <Link href="#" onClick={() => handleViewUserDetails(user)}>
                      <Typography variant="body1" color={'primary'}>
                        {' '}
                        {user.name}{' '}
                      </Typography>
                      <Typography variant="caption" color={'gray'}>
                        {' '}
                        ({user.email}){' '}
                      </Typography>
                    </Link>
                  </div>
                );
              })}
            <Pagination count={totalPages} page={page} onChange={handleOnChangePage} />
          </div>
        </div>
        <div
          className={`${styles.visibilityWrapper}`}
          style={{ margin: '2rem 0rem', width: '60%' }}
        >
          {isDetailVisible &&
            currentUser && ( //quitar el !
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={`${styles.horizontalWrapper}`} style={{ padding: '1rem' }}>
                  <Typography
                    variant="caption"
                    sx={{ width: '20%', alignSelf: 'center' }}
                    color={'gray'}
                  >
                    {' '}
                    Email{' '}
                  </Typography>
                  <Typography variant="caption" sx={{ width: '80%' }}>
                    {' '}
                    {currentUser.email}{' '}
                  </Typography>
                </div>
                <div className={`${styles.horizontalWrapper}`} style={{ padding: '1rem' }}>
                  <Typography
                    variant="caption"
                    sx={{ width: '20%', alignSelf: 'center' }}
                    color={'gray'}
                  >
                    {' '}
                    Last login on{' '}
                  </Typography>
                  <Typography variant="caption" sx={{ width: '80%' }}>
                    {' '}
                    {currentUser.dateLastLogin}{' '}
                  </Typography>
                </div>
                <div className={`${styles.horizontalWrapper}`} style={{ padding: '1rem' }}>
                  <Typography
                    variant="caption"
                    sx={{ width: '20%', alignSelf: 'center' }}
                    color={'gray'}
                  >
                    {' '}
                    Registered on{' '}
                  </Typography>
                  <Typography variant="caption" sx={{ width: '80%' }}>
                    {' '}
                    -{' '}
                  </Typography>
                </div>
                <div className={`${styles.horizontalWrapper}`} style={{ padding: '1rem' }}>
                  <Typography
                    variant="caption"
                    sx={{ width: '20%', alignSelf: 'center' }}
                    color={'gray'}
                  >
                    {' '}
                    Total Pitches{' '}
                  </Typography>
                  <Typography variant="caption" sx={{ width: '80%', alignSelf: 'center' }}>
                    {' '}
                    -{' '}
                  </Typography>
                </div>
                <div className={`${styles.horizontalWrapper}`} style={{ padding: '1rem' }}>
                  <Typography
                    variant="caption"
                    sx={{ width: '20%', alignSelf: 'center' }}
                    color={'gray'}
                  >
                    {' '}
                    Used Pitches{' '}
                  </Typography>
                  <Typography variant="caption" sx={{ width: '80%', alignSelf: 'center' }}>
                    {' '}
                    -{' '}
                  </Typography>
                </div>
                <div
                  className={`${styles.horizontalWrapper}`}
                  style={{ padding: '1rem', width: '100vh' }}
                >
                  <Typography
                    variant="caption"
                    sx={{ width: '20%', alignSelf: 'center' }}
                    color={'gray'}
                  >
                    {' '}
                    Assign Email Template{' '}
                  </Typography>
                  <Select
                    defaultValue={templates?.length > 0 ? templates[0].emailtemplate[0]._id : ''}
                    placeholder="Select Email Template"
                    sx={{ width: '20vh' }}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
                    onChange={handleOnChangeTemplateSelected}
                  >
                    {templates.map((_, index) => (
                      <MenuItem key={index} value={templates[index].emailtemplate[0]._id}>
                        {templates[index].emailtemplate[0].subject}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button variant="contained" onClick={handleAssingTemplate}>
                    Assign
                  </Button>
                </div>
                <div className={`${styles.horizontalWrapper}`} style={{ padding: '1rem' }}>
                  <Typography
                    variant="caption"
                    sx={{ width: '20%', alignSelf: 'center' }}
                    color={'gray'}
                  >
                    {' '}
                    Recurring{' '}
                  </Typography>
                  <Switch
                    checked={recurringSelectIsVisible}
                    onChange={handleChangeSwitch}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
                {recurringSelectIsVisible && subscriptionsPlanList && (
                  <div className={`${styles.horizontalWrapper}`} style={{ padding: '1rem' }}>
                    <Typography
                      variant="caption"
                      sx={{ width: '20%', alignSelf: 'center' }}
                      color={'gray'}
                    >
                      {' '}
                      Select Plan{' '}
                    </Typography>
                    <Select
                      value={subscriptionPlanSelected?.id}
                      onChange={handleOnChangePlanSelected}
                      MenuProps={{
                        disableScrollLock: true,
                      }}
                      sx={{ width: '20vh' }}
                    >
                      {subscriptionsPlanList.map((_, index) => {
                        if (
                          subscriptionsPlanList[index].nickname &&
                          subscriptionsPlanList[index].nickname !== ''
                        )
                          return (
                            <MenuItem key={index} value={subscriptionsPlanList[index].id}>
                              {subscriptionsPlanList ? subscriptionsPlanList[index].nickname : null}
                            </MenuItem>
                          );
                      })}
                    </Select>
                    <Button variant="contained" onClick={handleChangePlan}>
                      Assign
                    </Button>
                  </div>
                )}

                <div
                  className={`${styles.horizontalWrapper}`}
                  style={{ padding: '1rem', width: '100vh' }}
                >
                  <Typography variant="caption" sx={{ width: '20%' }} color={'gray'}>
                    {' '}
                    Privileges{' '}
                  </Typography>
                  {currentUser &&
                    currentUser?.privileges.map((privilege, index) => (
                      <Chip key={index} color="success" label={privilege} />
                    ))}
                </div>
                {adminButtonsIsVisible && (
                  <div style={{ display: 'flex' }}>
                    <div className={`${styles.columnButtons}`}>
                      <Button
                        variant="contained"
                        sx={{ marginBottom: '1rem', padding: '1rem' }}
                        onClick={toggleAddCreditsIsVisible}
                      >
                        Add pitches
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ marginBottom: '1rem', padding: '1rem' }}
                        onClick={handleSignInAsUser}
                      >
                        Account Sign In
                      </Button>
                    </div>
                    <div className={`${styles.columnButtons}`}>
                      <Button
                        variant="contained"
                        sx={{ marginBottom: '1rem', padding: '1rem' }}
                        onClick={handleResetPassword}
                      >
                        Reset Password
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ marginBottom: '1rem', padding: '1rem' }}
                        onClick={toggleChangePrivilesIsVisible}
                      >
                        Add / Remove Privileges
                      </Button>
                    </div>
                    <div className={`${styles.columnButtons}`}>
                      <Button
                        variant="contained"
                        sx={{ marginBottom: '1rem', padding: '1rem' }}
                        onClick={handleRemoveUser}
                      >
                        Remove User
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ marginBottom: '1rem', padding: '1rem' }}
                        onClick={handleDisableUser}
                      >
                        {currentUserIsDisabled ? 'Enable' : 'Disable'}
                      </Button>
                    </div>
                  </div>
                )}
                {addCreditsIsVisible && (
                  <div className={`${styles.horizontalWrapper}`}>
                    <TextField
                      type="number"
                      label="Add Credits"
                      name="newCredits"
                      onChange={handleOnChangeNewAddCredits}
                      onFocus={() => setNewCredits('')}
                      value={newCredits}
                      sx={{ width: '20vh' }}
                    />
                    <IconButton aria-label="check" onClick={handleAddCredits} color="primary">
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      aria-label="cancel"
                      onClick={toggleAddCreditsIsVisible}
                      color="error"
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                )}
                {changePrivilegesIsVisible && (
                  <>
                    <div className={`${styles.horizontalWrapper}`}>
                      <Select value={privilegeToAdd} onChange={handleOnChangeNewPrivilegeSelect}>
                        {currentPrivilegeListToAdd &&
                          currentPrivilegeListToAdd.map((privilege) => (
                            <MenuItem key={privilege} value={privilege}>
                              {privilege}
                            </MenuItem>
                          ))}
                      </Select>
                      <Button variant="contained" onClick={handleAddPrivileges}>
                        Add Privilege
                      </Button>

                      <Select
                        value={privilegeToRemove}
                        onChange={handleOnChangePrivilegeToRemoveSelect}
                      >
                        {currentPrivilegeListToRemove &&
                          currentPrivilegeListToRemove.map((privilege) => (
                            <MenuItem key={privilege} value={privilege}>
                              {privilege}
                            </MenuItem>
                          ))}
                      </Select>
                      <Button variant="contained" onClick={handleRemovePrivileges}>
                        Remove Privilege
                      </Button>
                    </div>
                    <div className={`${styles.horizontalWrapper}`}>
                      <Button
                        variant="outlined"
                        onClick={toggleChangePrivilesIsVisible}
                        sx={{ marginTop: '1rem' }}
                      >
                        Back
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
