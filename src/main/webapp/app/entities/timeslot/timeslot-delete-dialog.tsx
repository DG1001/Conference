import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteEntity, getEntity } from './timeslot.reducer';

export const TimeslotDeleteDialog = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const [loadModal, setLoadModal] = useState(false);

  useEffect(() => {
    dispatch(getEntity(id));
    setLoadModal(true);
  }, []);

  const timeslotEntity = useAppSelector(state => state.timeslot.entity);
  const updateSuccess = useAppSelector(state => state.timeslot.updateSuccess);

  const handleClose = () => {
    navigate(`/timeslot${pageLocation.search}`);
  };

  useEffect(() => {
    if (updateSuccess && loadModal) {
      handleClose();
      setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity(timeslotEntity.id));
  };

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="timeslotDeleteDialogHeading">
        Löschen bestätigen
      </ModalHeader>
      <ModalBody id="conferenceApp.timeslot.delete.question">
        Soll Timeslot {timeslotEntity.id} wirklich dauerhaft gelöscht werden?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Abbrechen
        </Button>
        <Button id="jhi-confirm-delete-timeslot" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Löschen
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TimeslotDeleteDialog;
