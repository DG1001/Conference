import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row, Card, CardHeader, CardBody, Badge, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './talk.reducer';

export const TalkDetail = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  const talkEntity = useAppSelector(state => state.talk.entity);
  const loading = useAppSelector(state => state.talk.loading);

  useEffect(() => {
    dispatch(getEntity(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="talk-detail-container">
        <Row className="justify-content-center">
          <Col md="8">
            <Alert color="info">Loading talk details...</Alert>
          </Col>
        </Row>
      </div>
    );
  }

  if (!talkEntity || !talkEntity.id) {
    return (
      <div className="talk-detail-container">
        <Row className="justify-content-center">
          <Col md="8">
            <Alert color="warning">Talk not found or failed to load.</Alert>
          </Col>
        </Row>
      </div>
    );
  }

  const formatDateTime = (start, end) => {
    if (!start || !end) return '';

    const startDate = new Date(start);
    const endDate = new Date(end);

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };

    const formattedDate = startDate.toLocaleDateString('de-DE', dateOptions);
    const startTime = startDate.toLocaleTimeString('de-DE', timeOptions);
    const endTime = endDate.toLocaleTimeString('de-DE', timeOptions);

    return `${formattedDate}, ${startTime} - ${endTime}`;
  };

  return (
    <div className="talk-detail-container">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow-sm mb-4">
            <CardHeader className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0" data-cy="talkDetailsHeading">
                  {talkEntity.title}
                </h2>
                <div>
                  <Button tag={Link} to="/talk" replace color="light" className="me-2" data-cy="entityDetailsBackButton">
                    <FontAwesomeIcon icon="arrow-left" /> <span>Zurück</span>
                  </Button>
                  <Button tag={Link} to={`/talk/${talkEntity.id}/edit`} replace color="light">
                    <FontAwesomeIcon icon="pencil-alt" /> <span>Bearbeiten</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="8">
                  <div className="mb-4">
                    <h4 className="text-primary mb-3">
                      <FontAwesomeIcon icon="user" className="me-2" />
                      Speaker
                    </h4>
                    <p className="lead">{talkEntity.speaker}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-primary mb-3">
                      <FontAwesomeIcon icon="file-alt" className="me-2" />
                      Abstract
                    </h4>
                    <div className="p-3 bg-light rounded">
                      <p style={{ whiteSpace: 'pre-line' }}>{talkEntity.abstractText}</p>
                    </div>
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-4">
                    <div className="card border-info">
                      <div className="card-header bg-info text-white">
                        <FontAwesomeIcon icon="info-circle" className="me-2" />
                        Details
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <strong>ID:</strong> <Badge color="secondary">{talkEntity.id}</Badge>
                        </li>
                        <li className="list-group-item">
                          <strong>
                            <FontAwesomeIcon icon="map-marker-alt" className="me-1" /> Room:
                          </strong>{' '}
                          {talkEntity.room ? (
                            <Link to={`/room/${talkEntity.room.id}`}>
                              <Badge color="success">{talkEntity.room.name}</Badge>
                            </Link>
                          ) : (
                            <Badge color="warning">Not assigned</Badge>
                          )}
                        </li>
                        <li className="list-group-item">
                          <strong>
                            <FontAwesomeIcon icon="clock" className="me-1" /> Time:
                          </strong>{' '}
                          {talkEntity.timeslot ? (
                            <div className="mt-2">
                              <Link to={`/timeslot/${talkEntity.timeslot.id}`}>
                                <Badge color="success" className="p-2">
                                  {formatDateTime(talkEntity.timeslot.start, talkEntity.timeslot.end)}
                                </Badge>
                              </Link>
                            </div>
                          ) : (
                            <Badge color="warning">Not scheduled</Badge>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TalkDetail;
