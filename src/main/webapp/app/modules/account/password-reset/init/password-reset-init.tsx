import React, { useEffect } from 'react';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { Alert, Button, Col, Row } from 'reactstrap';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handlePasswordResetInit, reset } from '../password-reset.reducer';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const handleValidSubmit = ({ email }) => {
    dispatch(handlePasswordResetInit(email));
  };

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>Passwort zurücksetzen</h1>
          <Alert color="warning">
            <p>Geben Sie die Email Adresse ein, welche Sie bei der Registrierung verwendet haben.</p>
          </Alert>
          <ValidatedForm onSubmit={handleValidSubmit}>
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
              data-cy="emailResetPassword"
            />
            <Button color="primary" type="submit" data-cy="submit">
              Passwort zurücksetzen
            </Button>
          </ValidatedForm>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordResetInit;
