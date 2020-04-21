import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import Content from "./Content";
import Header from "./Header";

export default function Locations(props) {
  const {
    classes,
    handleDrawerToggle,

    // Login props
    signedIn,
    avatarSrc,
  } = props;

  const pathDict = {
    "/restaurants": "dashboard",
  };

  const tabValue = pathDict[useLocation().pathname];

  return (
    <div className={classes.app}>
      <Header
        onDrawerToggle={handleDrawerToggle}
        tabValue={tabValue}
        signedIn={signedIn}
        avatarSrc={avatarSrc}
      />
      <main className={classes.main}>
        <Content />
      </main>
    </div>
  );
}

Locations.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};
