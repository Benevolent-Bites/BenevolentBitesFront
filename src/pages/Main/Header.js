import React from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Notifications,
  Person
} from '@material-ui/icons'
import { Google } from 'grommet-icons'
import {
  AppBar,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Avatar,
  Button,
  Grid,
  Hidden,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import { ConditionalRender } from '../common';
import { Link } from 'react-router-dom';
import { frontUrl, getAvatar } from '../../endpoints';
import Cookies from 'js-cookie';
import clsx from 'clsx';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  buttonLink: {
    [theme.breakpoints.down("sm")]: {
      padding: 4,
      display: "flex",
      margin: "10px 15px 0",
      width: "-webkit-fill-available",
      "& svg": {
        width: "24px",
        height: "30px",
        marginRight: "15px",
        marginLeft: "-15px"
      },
      "& .fab,& .fas,& .far,& .fal,& .material-icons": {
        fontSize: "24px",
        lineHeight: "30px",
        width: "24px",
        height: "30px",
        marginRight: "15px",
        marginLeft: "-15px"
      },
      "& > span": {
        justifyContent: "flex-start",
        width: "100%"
      }
    }
  },
  manager: {
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    display: "inline-block"
  },
  topBar: {
    paddingTop: theme.spacing(2),
    marginBottom: -theme.spacing(1)
  },
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
    '&:hover': {
      borderColor: "#b0bec5",
      backgroundColor: "#caceda"
    }
  },
  titleBar: {
    marginTop: theme.spacing(2),
    '& h1': {
      fontSize: '2.5rem'
    }
  },
  dropdownItem: {
    fontSize: "13px",
    padding: "10px 20px",
    margin: "0 10px",
    borderRadius: "10px",
    WebkitTransition: "all 150ms linear",
    MozTransition: "all 150ms linear",
    OTransition: "all 150ms linear",
    MsTransition: "all 150ms linear",
    transition: "all 150ms linear",
    display: "block",
    clear: "both",
    fontWeight: "400",
    lineHeight: "1.42857143",
    color: "gray",
    whiteSpace: "nowrap",
    height: "unset",
    minHeight: "unset",
    "&:hover": {
      backgroundColor: "#ef5350",
      color: "white",
    }
  },
  popperNav: {
    [theme.breakpoints.down("sm")]: {
      position: "static !important",
      left: "unset !important",
      top: "unset !important",
      transform: "none !important",
      willChange: "unset !important",
      "& > div": {
        boxShadow: "none !important",
        marginLeft: "0rem",
        marginRight: "0rem",
        transition: "none !important",
        marginTop: "0px !important",
        marginBottom: "0px !important",
        padding: "0px !important",
        backgroundColor: "transparent !important",
        "& ul li": {
          color: "white!important",
          margin: "10px 15px 0!important",
          padding: "10px 15px !important",
          "&:hover": {
            backgroundColor: "hsla(0,0%,78%,.2)",
            boxShadow: "none"
          }
        }
      }
    }
  },
  popperClose: {
    pointerEvents: "none"
  },
});

function Header(props) {

  const { classes, onDrawerToggle, tabValue, signedIn } = props;

  const [openProfile, setOpenProfile] = React.useState(null);
  function handleClickProfile (event) {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  }
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  function logout () {
    Cookies.remove("bb-access", {path:'/'});
    Cookies.set("signed_in", "0");
    window.location.assign(frontUrl());
  }

  const [avatarSrc, setAvatarSrc] = React.useState("");
  if (signedIn) {
    window.fetch(
      getAvatar(),
      {
        mode: 'cors',
        credentials: 'include',
        method: 'GET',
        cache: 'no-cache'
      }
    ).then(result => {
        if (!result.ok) {
          throw new Error();
        }
        return result.json();
      }
    ).then(
    response => {
      setAvatarSrc(response.avatar);
    },
    error => {console.log(error)}
    )
  }

  return (
    <React.Fragment>  
      <AppBar color="primary" position="static" elevation={0} className={classes.topBar}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden mdUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <Menu />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
              <ConditionalRender condition={() => signedIn}>
              <Grid item>
                <Tooltip title="Alerts • No alerts">
                  <IconButton color="inherit" size="medium">
                    <Notifications />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <div className={classes.manager}>
                  <IconButton
                    simple={(!(window.innerWidth > 959)).toString()}
                    onClick={handleClickProfile}
                    className={classes.buttonLink}
                  >
                    <Avatar className={classes.avatar} src={avatarSrc}><Person /></Avatar>
                  </IconButton>
                  <Popper
                    open={Boolean(openProfile)}
                    anchorEl={openProfile}
                    transition
                    disablePortal
                    className={
                      clsx({ [classes.popperClose]: !openProfile }, classes.popperNav)
                    }
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        id="profile-menu-list-grow"
                        style={{
                          transformOrigin:
                            placement === "bottom" ? "center top" : "center bottom"
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleCloseProfile}>
                            <MenuList role="menu">
                              <MenuItem
                                onClick={() => {handleCloseProfile();logout()}}
                                className={classes.dropdownItem}
                              >
                                <Typography variant="body1">Log Out</Typography>
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </Grid>
            </ConditionalRender>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Typography variant="h6">Nearby Restaurants</Typography>
          <Tabs value={tabValue} textColor="inherit">
            <Tab style={{fontSize: '1.25rem'}} 
              textColor="inherit" label="Map" value="map" component={Link} to="/"/>
            <Tab style={{fontSize: '1.25rem'}} 
              textColor="inherit" label="List" value="list" component={Link} to="/list"/>
          </Tabs>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  tabValue: PropTypes.string.isRequired,
  signedIn: PropTypes.bool.isRequired
};

export default withStyles(styles)(Header);
