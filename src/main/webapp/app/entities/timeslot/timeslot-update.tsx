import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './timeslot.reducer';

export const TimeslotUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const timeslotEntity = useAppSelector(state => state.timeslot.entity);
  const loading = useAppSelector(state => state.timeslot.loading);
  const updating = useAppSelector(state => state.timeslot.updating);
  const updateSuccess = useAppSelector(state => state.timeslot.updateSuccess);

  const handleClose = () => {
    navigate(`/timeslot${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
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
    values.start = convertDateTimeToServer(values.start);
    values.end = convertDateTimeToServer(values.end);

    const entity = {
      ...timeslotEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          start: displayDefaultDateTime(),
          end: displayDefaultDateTime(),
        }
      : {
          ...timeslotEntity,
          start: convertDateTimeFromServer(timeslotEntity.start),
          end: convertDateTimeFromServer(timeslotEntity.end),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="conferenceApp.timeslot.home.createOrEditLabel" data-cy="TimeslotCreateUpdateHeading">
            Timeslot erstellen oder bearbeiten
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="timeslot-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Start"
                id="timeslot-start"
                name="start"
                data-cy="start"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: 'Dieses Feld wird benötigt.' },
                }}
              />
              <ValidatedField
                label="End"
                id="timeslot-end"
                name="end"
                data-cy="end"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: 'Dieses Feld wird benötigt.' },
                }}
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/timeslot" replace color="info">
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

export default TimeslotUpdate;
