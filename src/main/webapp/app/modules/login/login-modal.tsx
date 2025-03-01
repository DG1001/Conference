import React from 'react';
import { ValidatedField } from 'react-jhipster';
import { Alert, Button, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { type FieldError, useForm } from 'react-hook-form';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
  handleClose: () => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const login = ({ username, password, rememberMe }) => {
    props.handleLogin(username, password, rememberMe);
  };

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });

  const { loginError, handleClose } = props;

  const handleLoginSubmit = e => {
    handleSubmit(login)(e);
  };

  return (
    <Modal isOpen={props.showModal} toggle={handleClose} backdrop="static" id="login-page" autoFocus={false}>
      <Form onSubmit={handleLoginSubmit}>
        <ModalHeader id="login-title" data-cy="loginTitle" toggle={handleClose}>
          Anmeldung
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              {loginError ? (
                <Alert color="danger" data-cy="loginError">
                  <strong>Anmeldung fehlgeschlagen!</strong> Überprüfen Sie bitte Ihre Angaben und versuchen Sie es erneut.
                </Alert>
              ) : null}
            </Col>
            <Col md="12">
              <ValidatedField
                name="username"
                label="Benutzername"
                placeholder="Ihr Benutzername"
                required
                autoFocus
                data-cy="username"
                validate={{ required: 'Username cannot be empty!' }}
                register={register}
                error={errors.username as FieldError}
                isTouched={touchedFields.username}
              />
              <ValidatedField
                name="password"
                type="password"
                label="Passwort"
                placeholder="Ihr Passwort"
                required
                data-cy="password"
                validate={{ required: 'Password cannot be empty!' }}
                register={register}
                error={errors.password as FieldError}
                isTouched={touchedFields.password}
              />
              <ValidatedField name="rememberMe" type="checkbox" check label="Automatische Anmeldung" value={true} register={register} />
            </Col>
          </Row>
          <div className="mt-1">&nbsp;</div>
          <Alert color="warning">
            <Link to="/account/reset/request" data-cy="forgetYourPasswordSelector">
              Sie haben Ihr Passwort vergessen?
            </Link>
          </Alert>
          <Alert color="warning">
            <span>Sie haben noch keinen Zugang?</span> <Link to="/account/register">Registrieren Sie sich</Link>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose} tabIndex={1}>
            Abbrechen
          </Button>{' '}
          <Button color="primary" type="submit" data-cy="submit">
            Anmelden
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default LoginModal;
