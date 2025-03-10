import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createUser, getRoles, getUser, reset, updateUser } from './user-management.reducer';

export const UserManagementUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { login } = useParams<'login'>();
  const isNew = login === undefined;

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getUser(login));
    }
    dispatch(getRoles());
    return () => {
      dispatch(reset());
    };
  }, [login]);

  const handleClose = () => {
    navigate('/admin/user-management');
  };

  const saveUser = values => {
    if (isNew) {
      dispatch(createUser(values));
    } else {
      dispatch(updateUser(values));
    }
    handleClose();
  };

  const isInvalid = false;
  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const updating = useAppSelector(state => state.userManagement.updating);
  const authorities = useAppSelector(state => state.userManagement.authorities);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>Benutzer erstellen oder bearbeiten</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm onSubmit={saveUser} defaultValues={user}>
              {user.id ? <ValidatedField type="text" name="id" required readOnly label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                type="text"
                name="login"
                label="Login"
                validate={{
                  required: {
                    value: true,
                    message: 'Ihr Benutzername wird benötigt.',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                    message: 'Ihr Benutzername ist ungültig.',
                  },
                  minLength: {
                    value: 1,
                    message: 'Ihr Benutzername muss mindestens ein Zeichen lang sein.',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Ihr Benutzername darf nicht länger als 50 Zeichen sein.',
                  },
                }}
              />
              <ValidatedField
                type="text"
                name="firstName"
                label="Vorname"
                validate={{
                  maxLength: {
                    value: 50,
                    message: 'Dieses Feld darf max. 50 Zeichen lang sein.',
                  },
                }}
              />
              <ValidatedField
                type="text"
                name="lastName"
                label="Nachname"
                validate={{
                  maxLength: {
                    value: 50,
                    message: 'Dieses Feld darf max. 50 Zeichen lang sein.',
                  },
                }}
              />
              <FormText>This field cannot be longer than 50 characters.</FormText>
              <ValidatedField
                name="email"
                label="Email Adresse"
                placeholder="Ihre Email Adresse"
                type="email"
                validate={{
                  required: {
                    value: true,
                    message: 'Ihre Email Adresse wird benötigt.',
                  },
                  minLength: {
                    value: 5,
                    message: 'Ihre Email Adresse muss mindestens 5 Zeichen lang sein',
                  },
                  maxLength: {
                    value: 254,
                    message: 'Ihre Email Adresse darf nicht länger als 50 Zeichen sein',
                  },
                  validate: v => isEmail(v) || 'Ihre Email Adresse ist ungültig.',
                }}
              />
              <ValidatedField type="checkbox" name="activated" check value={true} disabled={!user.id} label="Aktiv" />
              <ValidatedField type="select" name="authorities" multiple label="Profile">
                {authorities.map(role => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </ValidatedField>
              <Button tag={Link} to="/admin/user-management" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Zurück</span>
              </Button>
              &nbsp;
              <Button color="primary" type="submit" disabled={isInvalid || updating}>
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

export default UserManagementUpdate;
