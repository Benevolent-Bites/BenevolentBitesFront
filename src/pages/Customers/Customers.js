import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import Content from "./Content";
import Header from "./Header";
import * as Colors from "../Colors";

const drawerWidth = 290;
const styles = (theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    padding: theme.spacing(6, 4),
    background: Colors.BackgroundHighlight,
  },
  footer: {
    padding: theme.spacing(2),
    background: Colors.BackgroundHighlight,
  },
});

function Customers(props) {
  const {
    classes,
    handleDrawerToggle,
    cards,
    setCards,

    // Login props
    signedIn,
    avatarSrc,
  } = props;

  const pathDict = {
    "/users": "cards",
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
        <Content tabValue={tabValue} cards={cards} setCards={setCards} />
      </main>
    </div>
  );
}

Customers.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  cards: PropTypes.array.isRequired,
  setCards: PropTypes.func.isRequired,
};

export default withStyles(styles)(Customers);
