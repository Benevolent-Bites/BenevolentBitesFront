import React from 'react';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ConditionalRender, Spinner } from '../common';
import RestaurantCard from './RestaurantCard';
import { Route, Switch, Link } from 'react-router-dom';
import { userBuy, searchCoords, restGetDetails } from '../../endpoints';
import {
  AppBar,
  Toolbar,
  Typography,
  ClickAwayListener,
  Paper,
  Box,
  Backdrop,
  Grid,
  Container,
  CircularProgress,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Collapse,
  CardHeader,
  Button,
  Footer,
  IconButton,
  TextField,
  Divider,
  ButtonGroup
} from '@material-ui/core'

import {
  CheckRounded,
  CloseRounded,
  AddRounded,
  ExitToAppRounded,
  SearchRounded,
  ExpandMore,
  AttachMoney
} from '@material-ui/icons'

import GoogleMapsContainer from './Maps';

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    padding: theme.spacing(3.4),
    overflow: 'hidden',
    '& p': {
      fontSize: '1.3rem'
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    marginRight: theme.spacing(0.5),
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  card: {
    borderRadius: '10px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formGrid: {
    marginTop: theme.spacing(3)
  },
  searchBar: {
    border: '1px solid rgba(0, 0, 0, 0.25)',
    marginTop: -theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderWidth: '1px',
    borderRadius: '10px',
    borderStyle: 'solid'
  },
  searchInput: {
    fontSize: '1.25rem',
    color: '#000000'
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  submitButton: {
    marginTop: theme.spacing(3)
  },
  logoutButton: {
    marginTop: theme.spacing(2)
  },
  resultText: {
    marginRight: theme.spacing(2)
  },
  headerMessage: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: theme.spacing(2)
    }
  }
});

function TabPanel(props) {
  const { children, tabValue, index } = props;
  return (
    index === tabValue && children
  )
}

const test_on = {
  image: "",
  description: "Custom description - Restaurants that sign up can add their own custom description for users to read.",
  uuid: '8a3d5c7f-157d-1c4d-963d-7e8d93e4a89b',
  name: "Test Restaurant",
  priceLevel: 1,
  rating: 4.5,
  latitude: 30.273788,
  longitude: -97.800623,
  address: "3201 Bee Cave Rd. Austin, TX 78746"
};

class MainView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      lastSearch: "",
      searchValue: "restaurants",
      range: 5,
      coords: {},
      on: [],
      off: [],
      loading: false
    }
  }

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          coords: {lat: position.coords.latitude, lng: position.coords.longitude}
        })
        this.searchRestaurants();
    })
  }

  handleChange(e) {
    this.setState({searchValue: e.target.value});
  }

  searchRestaurants() {
    const {lat, lng} = this.state.coords;
    let ok;
    if(this.state.searchValue === this.state.lastSearch) {
      return
    }
    this.setState({loading: true});
    this.setState({lastSearch: this.state.searchValue});
    this.setState({on: [], off: []});
    window.fetch(
      searchCoords() + "?query=" + this.state.searchValue + "&lat=" + lat + "&lng=" + lng + "&range=" + this.state.range,
      {
        method: "GET",
        mode: "cors"
      }
    ).then(result => {ok = result.ok; return result.json()}
    ).then(response => {
      if (!ok) {
        throw new Error(response.error);
      }
      return response
    }).then(data => {
      this.setState({
        loading: false,
        on: data.on,
        off: data.off
      })
    }, error => console.log(error));
  }

  render () {
    const on = [...this.state.on, test_on]; // for testing

    const list = [...on.map(obj => {
        return {...obj, on: true}
      }), ...this.state.off.map(obj => {
        return {...obj, on: false}
    })]

    const classes = this.props.classes;
    return (<React.Fragment>
      <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchRounded className={classes.block} color="inherit" />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Search for a Restaurant"
                  onChange={this.handleChange.bind(this)}
                  value={this.state.searchValue}
                  InputProps={{
                    disableUnderline: true,
                    className: classes.searchInput,
                    onKeyDown: e => e.key === "Enter" ? this.searchRestaurants() : false,
                    onBlur: () => this.searchRestaurants()
                  }}
                />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      <TabPanel index="list" tabValue={this.props.tabValue}>
        <ConditionalRender condition={() => this.state.on.length > 0 || this.state.off.length > 0} alt={
          <Paper className={classes.paper}><Typography align="center" variant="h5">No Search Results</Typography></Paper>
        }>
          <Grid container spacing={3}>
            <Grid container spacing={2} item xs={12} lg={6} alignContent="flex-start">
              <Grid item xs={12}>
                <Typography align="center" variant="h5" style={{marginBottom: "7px"}}>Offering Credit</Typography>
                <Divider light />
              </Grid>
              {on.map((data) => <Grid item xs={12} sm={6}><RestaurantCard signedIn={this.props.signedIn} 
                supported classes={classes} data={data}/></Grid>)}
            </Grid>
            <Divider orientation='vertical' light flexItem style={{marginTop: '52px'}} />
            <Grid container spacing={2} item xs={12} lg={6} alignContent="flex-start">
              <Grid item xs={12}>
                <Typography align="center" variant="h5" style={{marginBottom: "7px"}}>Not Yet Supported</Typography>
                <Divider light />
              </Grid>
              {this.state.off.map((data) => <Grid item xs={12} sm={6}><RestaurantCard classes={classes} data={data}/></Grid>)}
            </Grid>
          </Grid>
        </ConditionalRender>
        <Backdrop className={classes.backdrop} open={this.state.loading}><CircularProgress/></Backdrop>
      </TabPanel>
      <TabPanel index="map" tabValue={this.props.tabValue}>
        <GoogleMapsContainer signedIn={this.props.signedIn} coords={this.state.coords} list={list}/>
        <Backdrop className={classes.backdrop} open={this.state.loading}><CircularProgress/></Backdrop>
      </TabPanel>
    </React.Fragment>)
  }
}

function Content(props) {
  const { classes, tabValue, signedIn } = props;

  return (<MainView classes={classes} signedIn={signedIn} tabValue={tabValue}/>)
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  tabValue: PropTypes.string.isRequired,
  signedIn: PropTypes.bool.isRequired
};

export default withStyles(styles)(Content);
