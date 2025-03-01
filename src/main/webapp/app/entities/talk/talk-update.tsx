import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row, Card, CardHeader, CardBody } from 'reactstrap';
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

  // Debug log to check what's in talkEntity
  useEffect(() => {
    if (!isNew && talkEntity) {
      console.log('Talk entity loaded:', talkEntity);
    }
  }, [talkEntity]);

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

  const defaultValues = () => {
    if (isNew) {
      return {};
    }
    
    // Make sure we have a valid entity with all required fields
    if (!talkEntity || !talkEntity.id) {
      return {};
    }
    
    return {
      id: talkEntity.id,
      title: talkEntity.title || '',
      speaker: talkEntity.speaker || '',
      abstractText: talkEntity.abstractText || '',
      room: talkEntity.room ? talkEntity.room.id : '',
      timeslot: talkEntity.timeslot ? talkEntity.timeslot.id : '',
    };
  };

  // Format timeslot display for dropdown
  const formatTimeslot = timeslot => {
    if (!timeslot) return '';
    const startDate = new Date(timeslot.start);
    const endDate = new Date(timeslot.end);
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    const formattedDate = startDate.toLocaleDateString('de-DE', dateOptions);
    const startTime = startDate.toLocaleTimeString('de-DE', timeOptions);
    const endTime = endDate.toLocaleTimeString('de-DE', timeOptions);
    return `${formattedDate}, ${startTime} - ${endTime}`;
  };
  return (
    <div className="talk-update-container">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow-sm mb-4">
            <CardHeader className="bg-primary text-white">
              <h2 className="mb-0" id="conferenceApp.talk.home.createOrEditLabel" data-cy="TalkCreateUpdateHeading">
                <FontAwesomeIcon icon={isNew ? 'plus-circle' : 'edit'} className="me-2" />
                {isNew ? 'Talk erstellen' : 'Talk bearbeiten'}
              </h2>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <ValidatedForm key={talkEntity.id || 'new'} defaultValues={defaultValues()} onSubmit={saveEntity}>
                  {!isNew ? (
                    <Row className="mb-3">
                      <Col md="3">
                        <label className="form-label" htmlFor="talk-id">
                          ID
                        </label>
                      </Col>
                      <Col md="9">
                        <ValidatedField name="id" id="talk-id" data-cy="id" type="text" className="form-control" readOnly />
                      </Col>
                    </Row>
                  ) : null}
                  <Row className="mb-3">
                    <Col md="3">
                      <label className="form-label" htmlFor="talk-title">
                        <FontAwesomeIcon icon="heading" className="me-1" /> Title *
                      </label>
                    </Col>
                    <Col md="9">
                      <ValidatedField
                        id="talk-title"
                        name="title"
                        data-cy="title"
                        type="text"
                        validate={{
                          required: { value: true, message: 'Dieses Feld wird benötigt.' },
                        }}
                        placeholder="Enter talk title"
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <label className="form-label" htmlFor="talk-speaker">
                        <FontAwesomeIcon icon="user" className="me-1" /> Speaker *
                      </label>
                    </Col>
                    <Col md="9">
                      <ValidatedField
                        id="talk-speaker"
                        name="speaker"
                        data-cy="speaker"
                        type="text"
                        validate={{
                          required: { value: true, message: 'Dieses Feld wird benötigt.' },
                        }}
                        placeholder="Enter speaker name"
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <label className="form-label" htmlFor="talk-abstractText">
                        <FontAwesomeIcon icon="file-alt" className="me-1" /> Abstract *
                      </label>
                    </Col>
                    <Col md="9">
                      <ValidatedField
                        id="talk-abstractText"
                        name="abstractText"
                        data-cy="abstractText"
                        type="textarea"
                        rows={5}
                        validate={{
                          required: { value: true, message: 'Dieses Feld wird benötigt.' },
                        }}
                        placeholder="Enter talk abstract"
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="3">
                      <label className="form-label" htmlFor="talk-room">
                        <FontAwesomeIcon icon="map-marker-alt" className="me-1" /> Room *
                      </label>
                    </Col>
                    <Col md="9">
                      <ValidatedField id="talk-room" name="room" data-cy="room" type="select" required>
                        <option value="" key="0">
                          -- Select Room --
                        </option>
                        {rooms
                          ? rooms.map(otherEntity => (
                              <option value={otherEntity.id} key={otherEntity.id}>
                                {otherEntity.name}
                              </option>
                            ))
                          : null}
                      </ValidatedField>
                      <small className="form-text text-muted">Dieses Feld wird benötigt.</small>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col md="3">
                      <label className="form-label" htmlFor="talk-timeslot">
                        <FontAwesomeIcon icon="clock" className="me-1" /> Timeslot *
                      </label>
                    </Col>
                    <Col md="9">
                      <ValidatedField id="talk-timeslot" name="timeslot" data-cy="timeslot" type="select" required>
                        <option value="" key="0">
                          -- Select Timeslot --
                        </option>
                        {timeslots
                          ? timeslots.map(otherEntity => (
                              <option value={otherEntity.id} key={otherEntity.id}>
                                {formatTimeslot(otherEntity)}
                              </option>
                            ))
                          : null}
                      </ValidatedField>
                      <small className="form-text text-muted">Dieses Feld wird benötigt.</small>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/talk" replace color="secondary">
                      <FontAwesomeIcon icon="arrow-left" />
                      &nbsp;
                      <span>Zurück</span>
                    </Button>
                    <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                      <FontAwesomeIcon icon={updating ? 'spinner' : 'save'} spin={updating} />
                      &nbsp; Speichern
                    </Button>
                  </div>
                </ValidatedForm>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TalkUpdate;
