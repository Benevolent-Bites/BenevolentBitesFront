import React from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { withStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import Content from "./Content";
import Header from "./Header";
import { getAvatar } from "../../endpoints";
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
    background: "#eaeff1",
  },
  footer: {
    padding: theme.spacing(2),
    backgroundColor: Colors.BackgroundHighlight,
  },
});

function Main(props) {
  const { classes, handleDrawerToggle, history } = props;
  const initialSearchValue = new URLSearchParams(window.location.search).get("search") || "";
  const [searchValue, setSearchValue] = React.useState(initialSearchValue);

  console.log(searchValue);
  const pathDict = {
    "/": "map",
    "/list": "list",
  };

  var tabValue = pathDict[useLocation().pathname];
  if (!tabValue) {
    tabValue = "map";
  }

  const signedIn = Cookies.get("signed_in") === "1" || false;

  const [avatarSrc, setAvatarSrc] = React.useState("");
  if (signedIn) {
    window
      .fetch(getAvatar(), {
        mode: "cors",
        credentials: "include",
        method: "GET",
        cache: "no-cache",
      })
      .then((result) => {
        if (!result.ok) {
          throw new Error();
        }
        return result.json();
      })
      .then(
        (response) => {
          setAvatarSrc(response.avatar);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  return (
    <div className={classes.app}>
      <Header
        onDrawerToggle={handleDrawerToggle}
        tabValue={tabValue}
        signedIn={signedIn}
        avatarSrc={avatarSrc}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <main className={classes.main} id="main">
        <Content
          signedIn={signedIn}
          lmao="bitch"
          classes={classes}
          tabValue={tabValue}
          history={history}
          searchValue={(() => {console.log(searchValue); return searchValue})()}
        />
      </main>
    </div>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
