import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handlePasswordResetFinish, reset } from '../password-reset.reducer';

export const PasswordResetFinishPage = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');

  const [password, setPassword] = useState('');

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const handleValidSubmit = ({ newPassword }) => dispatch(handlePasswordResetFinish({ key, newPassword }));

  const updatePassword = event => setPassword(event.target.value);

  const getResetForm = () => {
    return (
      <ValidatedForm onSubmit={handleValidSubmit}>
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
          data-cy="resetPassword"
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
          data-cy="confirmResetPassword"
        />
        <Button color="success" type="submit" data-cy="submit">
          Neues Passwort setzen
        </Button>
      </ValidatedForm>
    );
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
        <Col md="4">
          <h1>Passwort zurücksetzen</h1>
          <div>{key ? getResetForm() : null}</div>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordResetFinishPage;
