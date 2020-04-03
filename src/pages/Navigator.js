import React from 'react';
import {
  NavLink,
  Link
} from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import {
  PeopleRounded,
  EmojiFoodBeverageRounded,
  HomeRounded,
  MenuBookRounded
} from '@material-ui/icons';

const categories = [
  {
    id: '',
    children: [
      { id: 'My Gift Cards', icon: <PeopleRounded />, link: "/users"},
      { id: 'Restaurant Portal', icon: <EmojiFoodBeverageRounded />, link: "/restaurants"},
    ],
  }
];

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
    fontSize: "1.45rem"
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 30,
    color: theme.palette.common.white,
  },
  firebaseIcon: {
    minWidth: 'auto',
    '& svg': {
      fontSize: 30
    }
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: '1.2rem',
  },
  itemDescription: {
    fontSize: '1rem'
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

function Navigator(props) {
  const { classes, ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem button component={Link} 
          to="/" className={clsx(classes.item, classes.firebase, classes.itemCategory)}>
          Benevolent Bites
          <ListItemIcon className={classes.firebaseIcon}>
            <HomeRounded fontSize="inherit" />
          </ListItemIcon>
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemText classes={{primary: classes.itemDescription}}>
            Providing meal credit to support your favorite restaurants during the COVID-19 outbreak.
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            {id ?
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem> : <br/>}
            {children.map(({ id: childId, icon, link }) => (
              <ListItem
                key={childId}
                button component={NavLink} to={link} activeClassName={classes.itemActiveItem}
                className={classes.item}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider} />
            <ListItem
                key="About Us"
                button component={NavLink} to={"/about"} activeClassName={classes.itemActiveItem}
                className={classes.item}
              >
                <ListItemIcon className={classes.itemIcon}><MenuBookRounded /></ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  About Us
                </ListItemText>
              </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
