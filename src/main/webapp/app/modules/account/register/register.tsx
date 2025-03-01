import React, { useEffect, useState } from 'react';
import { ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { Alert, Button, Col, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handleRegister, reset } from './register.reducer';

export const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const handleValidSubmit = ({ username, email, firstPassword }) => {
    dispatch(handleRegister({ login: username, email, password: firstPassword, langKey: 'en' }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1 id="register-title" data-cy="registerTitle">
            Registrierung
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          <ValidatedForm id="register-form" onSubmit={handleValidSubmit}>
            <ValidatedField
              name="username"
              label="Benutzername"
              placeholder="Ihr Benutzername"
              validate={{
                required: { value: true, message: 'Ihr Benutzername wird benötigt.' },
                pattern: {
                  value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                  message: 'Ihr Benutzername ist ungültig.',
                },
                minLength: { value: 1, message: 'Ihr Benutzername muss mindestens ein Zeichen lang sein.' },
                maxLength: { value: 50, message: 'Ihr Benutzername darf nicht länger als 50 Zeichen sein.' },
              }}
              data-cy="username"
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
            <ValidatedField
              name="firstPassword"
              label="Neues Passwort"
              placeholder="Neues Passwort"
              type="password"
              onChange={updatePassword}
              validate={{
                required: { value: true, message: 'Ein neues Passwort wird benötigt.' },
                minLength: { value: 4, message: 'Das neue Passwort muss mindestens 4 Zeichen lang sein' },
                maxLength: { value: 50, message: 'Das neue Passwort darf nicht länger als 50 Zeichen sein' },
              }}
              data-cy="firstPassword"
            />
            <PasswordStrengthBar password={password} />
            <ValidatedField
              name="secondPassword"
              label="Neues Passwort bestätigen"
              placeholder="Bestätigen Sie Ihr neues Passwort"
              type="password"
              validate={{
                required: { value: true, message: 'Sie müssen das Passwort bestätigen.' },
                minLength: { value: 4, message: 'Das bestätigte Passwort muss mindestens 4 Zeichen lang sein' },
                maxLength: { value: 50, message: 'Das bestätigte Passwort darf nicht länger als 50 Zeichen sein' },
                validate: v => v === password || 'Das bestätigte Passwort entspricht nicht dem neuen Passwort!',
              }}
              data-cy="secondPassword"
            />
            <Button id="register-submit" color="primary" type="submit" data-cy="submit">
              Registrieren
            </Button>
          </ValidatedForm>
          <p>&nbsp;</p>
          <Alert color="warning">
            <span>Wenn Sie sich </span>
            <Link to="/login" className="alert-link">
              anmelden
            </Link>
            <span>
              möchten, versuchen Sie es mit <br />- Administrator (Name=&quot;admin&quot; und Passwort=&quot;admin&quot;)
              <br />- Benutzer (Name=&quot;user&quot; und Passwort=&quot;user&quot;).
            </span>
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
