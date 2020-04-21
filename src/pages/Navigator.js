import React from "react";
import { NavLink, Link } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  PeopleRounded,
  EmojiFoodBeverageRounded,
  HomeRounded,
  MenuBookRounded,
} from "@material-ui/icons";
import * as Colors from "./Colors";

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: Colors.Background,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
    fontSize: "1.45rem",
    backgroundColor: Colors.Background,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: Colors.TextRegular,
    backgroundColor: Colors.Background,
    "&:hover,&:focus": {
      backgroundColor: Colors.BackgroundHighlight,
      color: Colors.White,
    },
  },
  itemCategory: {
    backgroundColor: Colors.Background,
    boxShadow: "0 -1px 0 #4F424B inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 30,
    color: theme.palette.common.white,
  },
  firebaseIcon: {
    minWidth: "auto",
    "& svg": {
      fontSize: 30,
    },
  },
  itemActiveItem: {
    color: Colors.TextHighlight,
  },
  itemActiveItemTitle: {
    color: Colors.Background,
  },
  itemPrimary: {
    fontSize: "1.2rem",
  },
  itemDescription: {
    fontSize: "1rem",
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    color: Colors.BackgroundHighlight,
    backgroundColor: Colors.BackgroundHighlight,
  },
});

function Navigator(props) {
  const { classes, ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List
        disablePadding
        style={{
          position: "absolute",
          backgroundColor: Colors.Background,
          marginLeft: "10%",
        }}
      >
        <ListItem
          component={Link}
          to="/"
          className={clsx(classes.firebase, classes.itemCategory)}
        >
          <img
            alt="restaurant"
            src={process.env.PUBLIC_URL + "/img/bb-logo.png"}
            style={{
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: 10,
            }}
          />
        </ListItem>

        <Divider className={classes.divider} />

        <ListItem
          key="Search"
          button
          component={NavLink}
          to={"/"}
          exact
          activeClassName={classes.itemActiveItem}
          className={classes.item}
        >
          <ListItemIcon className={classes.itemIcon}>
            <HomeRounded />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Search
          </ListItemText>
        </ListItem>

        <ListItem
          key="My Gift Cards"
          button
          component={NavLink}
          to={"/users"}
          activeClassName={classes.itemActiveItem}
          className={classes.item}
        >
          <ListItemIcon className={classes.itemIcon}>
            <PeopleRounded />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            My Gift Cards
          </ListItemText>
        </ListItem>

        <ListItem
          key="Our Mission"
          button
          component={NavLink}
          to={"/about"}
          activeClassName={classes.itemActiveItem}
          className={classes.item}
        >
          <ListItemIcon className={classes.itemIcon}>
            <MenuBookRounded />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Our Mission
          </ListItemText>
        </ListItem>
      </List>
      <List
        disablePadding
        style={{ position: "absolute", bottom: 20, marginLeft: "10%" }}
      >
        <Divider className={classes.divider} />
        <ListItem
          key={"Restaurant Portal"}
          button
          component={NavLink}
          to={"/restaurants"}
          activeClassName={classes.itemActiveItem}
          className={classes.item}
          style={{ marginTop: 10 }}
        >
          <ListItemIcon className={classes.itemIcon}>
            {<EmojiFoodBeverageRounded />}
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            {"Manager Portal"}
          </ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
