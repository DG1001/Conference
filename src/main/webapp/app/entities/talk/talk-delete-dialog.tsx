import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteEntity, getEntity } from './talk.reducer';

export const TalkDeleteDialog = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const [loadModal, setLoadModal] = useState(false);

  useEffect(() => {
    dispatch(getEntity(id));
    setLoadModal(true);
  }, []);

  const talkEntity = useAppSelector(state => state.talk.entity);
  const updateSuccess = useAppSelector(state => state.talk.updateSuccess);

  const handleClose = () => {
    navigate(`/talk${pageLocation.search}`);
  };

  useEffect(() => {
    if (updateSuccess && loadModal) {
      handleClose();
      setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity(talkEntity.id));
  };

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="talkDeleteDialogHeading">
        Löschen bestätigen
      </ModalHeader>
      <ModalBody id="conferenceApp.talk.delete.question">Soll Talk {talkEntity.id} wirklich dauerhaft gelöscht werden?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Abbrechen
        </Button>
        <Button id="jhi-confirm-delete-talk" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Löschen
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TalkDeleteDialog;
