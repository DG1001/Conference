import React, { useEffect, useState } from 'react';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { Button, Col, Row } from 'reactstrap';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { reset, savePassword } from './password.reducer';

export const PasswordPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  const handleValidSubmit = ({ currentPassword, newPassword }) => {
    dispatch(savePassword({ currentPassword, newPassword }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.password.successMessage);
  const errorMessage = useAppSelector(state => state.password.errorMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    } else if (errorMessage) {
      toast.error(errorMessage);
    }
    dispatch(reset());
  }, [successMessage, errorMessage]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="password-title">
            Passwort für [<strong>{account.login}</strong>]
          </h2>
          <ValidatedForm id="password-form" onSubmit={handleValidSubmit}>
            <ValidatedField
              name="currentPassword"
              label="Aktuelles Passwort"
              placeholder="Aktuelles Passwort"
              type="password"
              validate={{
                required: { value: true, message: 'Ein neues Passwort wird benötigt.' },
              }}
              data-cy="currentPassword"
            />
            <ValidatedField
              name="newPassword"
              label="Neues Passwort"
              placeholder="Neues Passwort"
              type="password"
              validate={{
                required: { value: true, message: 'Ein neues Passwort wird benötigt.' },
                minLength: { value: 4, message: 'Das neue Passwort muss mindestens 4 Zeichen lang sein' },
                maxLength: { value: 50, message: 'Das neue Passwort darf nicht länger als 50 Zeichen sein' },
              }}
              onChange={updatePassword}
              data-cy="newPassword"
            />
            <PasswordStrengthBar password={password} />
            <ValidatedField
              name="confirmPassword"
              label="Neues Passwort bestätigen"
              placeholder="Bestätigen Sie Ihr neues Passwort"
              type="password"
              validate={{
                required: { value: true, message: 'Sie müssen das Passwort bestätigen.' },
                minLength: { value: 4, message: 'Das bestätigte Passwort muss mindestens 4 Zeichen lang sein' },
                maxLength: { value: 50, message: 'Das bestätigte Passwort darf nicht länger als 50 Zeichen sein' },
                validate: v => v === password || 'Das bestätigte Passwort entspricht nicht dem neuen Passwort!',
              }}
              data-cy="confirmPassword"
            />
            <Button color="success" type="submit" data-cy="submit">
              Speichern
            </Button>
          </ValidatedForm>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordPage;
