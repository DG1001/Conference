import React, { useEffect } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { reset, saveAccountSettings } from './settings.reducer';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.settings.successMessage);

  useEffect(() => {
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  const handleValidSubmit = values => {
    dispatch(
      saveAccountSettings({
        ...account,
        ...values,
      }),
    );
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="settings-title">
            Einstellungen für Benutzer [<strong>{account.login}</strong>]
          </h2>
          <ValidatedForm id="settings-form" onSubmit={handleValidSubmit} defaultValues={account}>
            <ValidatedField
              name="firstName"
              label="Vorname"
              id="firstName"
              placeholder="Ihr Vorname"
              validate={{
                required: { value: true, message: 'Ihr Vorname wird benötigt.' },
                minLength: { value: 1, message: 'Ihr Vorname muss mindestens 1 Zeichen lang sein' },
                maxLength: { value: 50, message: 'Ihr Vorname darf nicht länger als 50 Zeichen sein' },
              }}
              data-cy="firstname"
            />
            <ValidatedField
              name="lastName"
              label="Nachname"
              id="lastName"
              placeholder="Ihr Nachname"
              validate={{
                required: { value: true, message: 'Ihr Nachname wird benötigt.' },
                minLength: { value: 1, message: 'Ihr Nachname muss mindestens 1 Zeichen lang sein' },
                maxLength: { value: 50, message: 'Ihr Nachname darf nicht länger als 50 Zeichen sein' },
              }}
              data-cy="lastname"
            />
            <ValidatedField
              name="email"
              label="Email Adresse"
              placeholder="Ihre Email Adresse"
              type="email"
              validate={{
                required: { value: true, message: 'Ihre Email Adresse wird benötigt.' },
                minLength: { value: 5, message: 'Ihre Email Adresse muss mindestens 5 Zeichen lang sein' },
                maxLength: { value: 254, message: 'Ihre Email Adresse darf nicht länger als 50 Zeichen sein' },
                validate: v => isEmail(v) || 'Ihre Email Adresse ist ungültig.',
              }}
              data-cy="email"
            />
            <Button color="primary" type="submit" data-cy="submit">
              Speichern
            </Button>
          </ValidatedForm>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
