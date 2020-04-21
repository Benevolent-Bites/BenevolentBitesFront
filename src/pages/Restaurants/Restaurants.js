import React from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { Typography, Card, IconButton, Box } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import Content from "./Content";
import Header from "./Header";
import { ConditionalRender, Spinner } from "../common";
import { LoginHandler } from "../LoginHandler";

export default function Restaurants(props) {
  const {
    classes,
    handleDrawerToggle,
    info,
    setInfo,

    // Login props
    signedIn,
    avatarSrc,
  } = props;

  const pathDict = {
    "/restaurants": "dashboard",
    "/restaurants/info": "info",
    "/restaurants/employees": "employees",
    "/restaurants/setpassword": "password",
    "/restaurants/data": "data",
  };

  const tabValue = pathDict[useLocation().pathname];

  const needsVerify = false;

  return (
    <div className={classes.app}>
      <Header
        onDrawerToggle={handleDrawerToggle}
        tabValue={tabValue}
        signedIn={signedIn}
        avatarSrc={avatarSrc}
      />
      <main className={classes.main}>
        <Content info={info} setInfo={setInfo} tabValue={tabValue} />
      </main>
    </div>
  );
}

Restaurants.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
  setInfo: PropTypes.func.isRequired,
};
