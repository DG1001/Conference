import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './talk.reducer';

export const TalkDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const talkEntity = useAppSelector(state => state.talk.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="talkDetailsHeading">Talk</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{talkEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{talkEntity.title}</dd>
          <dt>
            <span id="speaker">Speaker</span>
          </dt>
          <dd>{talkEntity.speaker}</dd>
          <dt>
            <span id="abstractText">Abstract Text</span>
          </dt>
          <dd>{talkEntity.abstractText}</dd>
          <dt>Room</dt>
          <dd>{talkEntity.room ? talkEntity.room.name : ''}</dd>
          <dt>Timeslot</dt>
          <dd>{talkEntity.timeslot ? `${talkEntity.timeslot.start} - ${talkEntity.timeslot.end}` : ''}</dd>
        </dl>
        <Button tag={Link} to="/talk" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Zurück</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/talk/${talkEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Bearbeiten</span>
        </Button>
      </Col>
    </Row>
  );
};

export default TalkDetail;
