import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getRooms } from 'app/entities/room/room.reducer';
import { getEntities as getTimeslots } from 'app/entities/timeslot/timeslot.reducer';
import { createEntity, getEntity, reset, updateEntity } from './talk.reducer';

export const TalkUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const rooms = useAppSelector(state => state.room.entities);
  const timeslots = useAppSelector(state => state.timeslot.entities);
  const talkEntity = useAppSelector(state => state.talk.entity);
  const loading = useAppSelector(state => state.talk.loading);
  const updating = useAppSelector(state => state.talk.updating);
  const updateSuccess = useAppSelector(state => state.talk.updateSuccess);

  const handleClose = () => {
    navigate(`/talk${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getRooms({}));
    dispatch(getTimeslots({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }

    const entity = {
      ...talkEntity,
      ...values,
      room: rooms.find(it => it.id.toString() === values.room?.toString()),
      timeslot: timeslots.find(it => it.id.toString() === values.timeslot?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...talkEntity,
          room: talkEntity?.room?.id,
          timeslot: talkEntity?.timeslot?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="conferenceApp.talk.home.createOrEditLabel" data-cy="TalkCreateUpdateHeading">
            Talk erstellen oder bearbeiten
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="talk-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Title"
                id="talk-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: 'Dieses Feld wird benötigt.' },
                }}
              />
              <ValidatedField
                label="Speaker"
                id="talk-speaker"
                name="speaker"
                data-cy="speaker"
                type="text"
                validate={{
                  required: { value: true, message: 'Dieses Feld wird benötigt.' },
                }}
              />
              <ValidatedField
                label="Abstract Text"
                id="talk-abstractText"
                name="abstractText"
                data-cy="abstractText"
                type="textarea"
                validate={{
                  required: { value: true, message: 'Dieses Feld wird benötigt.' },
                }}
              />
              <ValidatedField id="talk-room" name="room" data-cy="room" label="Room" type="select" required>
                <option value="" key="0" />
                {rooms
                  ? rooms.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>Dieses Feld wird benötigt.</FormText>
              <ValidatedField id="talk-timeslot" name="timeslot" data-cy="timeslot" label="Timeslot" type="select" required>
                <option value="" key="0" />
                {timeslots
                  ? timeslots.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>Dieses Feld wird benötigt.</FormText>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/talk" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Zurück</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Speichern
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TalkUpdate;
