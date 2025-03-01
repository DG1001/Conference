import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { JhiItemCount, JhiPagination, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './talk.reducer';

export const Talk = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const talkList = useAppSelector(state => state.talk.entities);
  const loading = useAppSelector(state => state.talk.loading);
  const totalItems = useAppSelector(state => state.talk.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  // Add custom CSS for card hover effect
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hover-shadow {
        transition: all 0.3s ease;
      }
      .hover-shadow:hover {
        transform: translateY(-5px);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
      }
      .text-truncate {
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div>
      <h2 id="talk-heading" data-cy="TalkHeading">
        Talks
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Liste aktualisieren
          </Button>
          <Link to="/talk/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Talk erstellen
          </Link>
        </div>
      </h2>
      <div className="talk-list-container">
        {talkList && talkList.length > 0 ? (
          <div className="row">
            {talkList.map((talk, i) => (
              <div key={`entity-${i}`} className="col-md-6 col-lg-4 mb-4" data-cy="entityTable">
                <div className="card h-100 shadow-sm hover-shadow">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0 text-truncate" title={talk.title}>
                      {talk.title}
                    </h5>
                    <Button tag={Link} to={`/talk/${talk.id}`} color="link" size="sm" className="p-0">
                      <FontAwesomeIcon icon="eye" />
                    </Button>
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <strong>Speaker:</strong> {talk.speaker}
                    </div>
                    {talk.abstractText && (
                      <div className="mb-2">
                        <p className="card-text text-truncate" title={talk.abstractText}>
                          {talk.abstractText}
                        </p>
                      </div>
                    )}
                    <div className="mb-2">
                      <strong>Room:</strong> {talk.room ? <Link to={`/room/${talk.room.id}`}>{talk.room.name}</Link> : 'Not assigned'}
                    </div>
                    <div className="mb-3">
                      <strong>Time:</strong>{' '}
                      {talk.timeslot ? (
                        <Link to={`/timeslot/${talk.timeslot.id}`}>
                          {`${new Date(talk.timeslot.start).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} ${new Date(
                            talk.timeslot.start
                          ).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - ${new Date(
                            talk.timeslot.end
                          ).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`}
                        </Link>
                      ) : (
                        'Not scheduled'
                      )}
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-flex justify-content-between">
                      <Button tag={Link} to={`/talk/${talk.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span>Details</span>
                      </Button>
                      <div>
                        <Button
                          tag={Link}
                          to={`/talk/${talk.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                          color="primary"
                          size="sm"
                          className="me-1"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon="pencil-alt" />
                        </Button>
                        <Button
                          onClick={() =>
                            (window.location.href = `/talk/${talk.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                          }
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon="trash" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <FontAwesomeIcon icon="info-circle" /> Keine Talks gefunden
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={talkList && talkList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Talk;
