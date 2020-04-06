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
import { restLogin, frontUrl, getAvatar } from '../../endpoints';
import Cookies from 'js-cookie';
import clsx from 'clsx';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  manager: {
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

  const { classes, onDrawerToggle, tabValue, signedIn, avatarSrc } = props;

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

  return (
    <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onDrawerToggle}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
          </Hidden>
          <Tabs value={tabValue} textColor="inherit" variant="scrollable">
            <Tab style={{fontSize: '1.25rem'}} 
                textColor="inherit" label="Dashboard" value="dashboard" component={Link} to="/restaurants"/>
            <Tab style={{fontSize: '1.25rem'}} 
              textColor="inherit" label="My Info" value="info" component={Link} to="/restaurants/info"/>
            <Tab style={{fontSize: '1.25rem'}} 
              textColor="inherit" label="My Employees" value="employees" component={Link} to="/restaurants/employees"/>
            <Tab style={{fontSize: '1.25rem'}} 
              textColor="inherit" label="Security Code" value="password" component={Link} to="/restaurants/setpassword"/>
          </Tabs>
          <ConditionalRender condition={() => signedIn}>
            <Tooltip title="Alerts • No alerts">
              <IconButton color="inherit" size="medium" style={{marginLeft: 'auto'}}>
                <Notifications />
              </IconButton>
            </Tooltip>
            <div className={classes.manager} style={{marginRight: '10px'}}>
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
          </ConditionalRender>
        </Toolbar>
      </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  tabValue: PropTypes.string.isRequired,
  signedIn: PropTypes.bool.isRequired,
  avatarSrc: PropTypes.string.isRequired,
};

export default withStyles(styles)(Header);
