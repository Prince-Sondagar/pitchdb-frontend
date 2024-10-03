import { useState } from 'react';
import { Button, Modal, Typography } from '@mui/material';
import { useAppSelector } from '../../../redux/hooks';
import { contactListSelectors } from '../../../redux/contactList';
import { LoadingDisplay, MultiSelectInput } from '../../../common';
import { ISelectInputOption, IUserContactList, loadingDisplayTypes } from '../../../types';
import styles from '../ContactSearches.module.css';

interface IProps {
  isOpen: boolean;
  selectedItemsAmount: number;
  isLoading: boolean;
  handleClose: () => void;
  handleAddItemsToLists: (listsSelected: ISelectInputOption[]) => void;
}

export function AddToContactsModal({
  isOpen,
  selectedItemsAmount,
  isLoading,
  handleClose,
  handleAddItemsToLists,
}: IProps) {
  const contactLists = useAppSelector(contactListSelectors.contactLists);

  const [selectedLists, setSelectedLists] = useState<ISelectInputOption[]>([]);

  const convertContactListsToSelectOptions = (listToEvaluate: IUserContactList[]) => {
    const options: ISelectInputOption[] = [];

    listToEvaluate.map((list) => {
      options.push({
        _id: list._id,
        label: list.name,
        value: list.name,
      });
    });

    return options;
  };

  return (
    <Modal open={isOpen} onClose={handleClose} className={styles.modalWrapper}>
      <div className={styles.addContactsModalWrapper}>
        <Typography variant="h3" color="primary.main" m="2rem 0">
          Add contacts to list
        </Typography>
        {isLoading ? (
          <LoadingDisplay type={loadingDisplayTypes.entireComponent} />
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" fontWeight="bold" gutterBottom>
              Select list
            </Typography>
            <MultiSelectInput
              inputLabel="Contact list"
              options={convertContactListsToSelectOptions(contactLists)}
              selectedOptions={selectedLists}
              handleChange={(options) => setSelectedLists(options)}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedLists.length}
              onClick={() => handleAddItemsToLists(selectedLists)}
              sx={{ m: '2rem 0' }}
            >
              {`Add ${selectedItemsAmount} item${
                selectedItemsAmount > 1 ? 's' : ''
              } to contact list`}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
