import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { Alert, Col, Row } from 'reactstrap';

import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <Row>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
      <Col md="9">
        <h1 className="display-4">Willkommen, Java Hipster!</h1>
        <p className="lead">Dies ist Ihre Hauptseite</p>
        {account?.login ? (
          <div>
            <Alert color="success">Sie sind als Benutzer &quot;{account.login}&quot; angemeldet.</Alert>
          </div>
        ) : (
          <div>
            <Alert color="warning">
              Wenn Sie sich
              <span>&nbsp;</span>
              <Link to="/login" className="alert-link">
                anmelden
              </Link>
              möchten, versuchen Sie es mit <br />- Administrator (Name=&quot;admin&quot; und Passwort=&quot;admin&quot;)
              <br />- Benutzer (Name=&quot;user&quot; und Passwort=&quot;user&quot;).
            </Alert>

            <Alert color="warning">
              Sie haben noch keinen Zugang?&nbsp;
              <Link to="/account/register" className="alert-link">
                Registrieren Sie sich
              </Link>
            </Alert>
          </div>
        )}
        <p>Wenn Sie Fragen zu JHipster haben:</p>

        <ul>
          <li>
            <a href="https://www.jhipster.tech/" target="_blank" rel="noopener noreferrer">
              JHipster Hauptseite
            </a>
          </li>
          <li>
            <a href="https://stackoverflow.com/tags/jhipster/info" target="_blank" rel="noopener noreferrer">
              JHipster auf Stack Overflow
            </a>
          </li>
          <li>
            <a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" rel="noopener noreferrer">
              JHipster Fehlereinträge
            </a>
          </li>
          <li>
            <a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
              JHipster Chat
            </a>
          </li>
          <li>
            <a href="https://twitter.com/jhipster" target="_blank" rel="noopener noreferrer">
              kontaktieren Sie uns mit @jhipster auf Twitter
            </a>
          </li>
        </ul>

        <p>
          Wenn Sie JHipster mögen, vergessen Sie nicht uns einen Stern zu geben auf{' '}
          <a href="https://github.com/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          !
        </p>
      </Col>
    </Row>
  );
};

export default Home;
