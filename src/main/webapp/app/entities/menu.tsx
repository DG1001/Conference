import React from 'react';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/room">
        Room
      </MenuItem>
      <MenuItem icon="asterisk" to="/timeslot">
        Timeslot
      </MenuItem>
      <MenuItem icon="asterisk" to="/talk">
        Talk
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
