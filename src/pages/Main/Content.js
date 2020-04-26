import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ConditionalRender, Spinner, Memoized } from "../common";
import RestaurantCard from "./RestaurantCard";
import { searchCoords } from "../../endpoints";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Backdrop,
  Grid,
  CircularProgress,
  TextField,
  Card,
  Snackbar,
  Divider,
  Box,
} from "@material-ui/core";
import * as Colors from "../Colors";

import { SearchRounded } from "@material-ui/icons";

import GoogleMapsContainer from "./Maps";

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    padding: theme.spacing(3.4),
    overflow: "hidden",
    "& p": {
      fontSize: "1.3rem",
    },
    color: Colors.White,
    backgroundColor: Colors.TextRegular,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#ffffff",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    marginRight: theme.spacing(0.5),
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  card: {
    borderRadius: "10px",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formGrid: {
    marginTop: theme.spacing(3),
  },
  searchBar: {
    border: "1px solid rgba(0, 0, 0, 0.25)",
    marginTop: -theme.spacing(3),
    marginBottom: -theme.spacing(10),
    borderWidth: "1px",
    borderRadius: "10px",
    borderStyle: "solid",
    marginLeft: "20%",
    marginRight: "30px",
    paddingRight: "20%",
    width: "60%",
    zIndex: 2,
  },
  searchInput: {
    fontSize: "1.25rem",
    color: "#000000",
  },
  block: {
    display: "block",
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: "40px 16px",
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
  logoutButton: {
    marginTop: theme.spacing(2),
  },
  resultText: {
    marginRight: theme.spacing(2),
  },
  headerMessage: {
    display: "flex",
    alignItems: "center",
    "& > *": {
      marginRight: theme.spacing(2),
    },
  },
});

function TabPanel(props) {
  const { children, tabValue, index } = props;
  return index === tabValue && children;
}

class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: 5,
      coords: {},
      on: [],
      off: [],
      loading: false,
    };
  }

  async componentDidMount() {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        coords: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
      this.searchRestaurants(true);
    });
    let err = new URLSearchParams(window.location.search).get("error");
    if (err) {
      this.setState({ error: err });
    }
  }

  searchRestaurants(override = false, map = false) {
    const queryString = new URLSearchParams(window.location.search);
    if (
      this.props.searchValue === queryString.get("search") ||
      Object.keys(this.state.coords).length === 0
    ) {
      if (!override) {
        return;
      }
    }
    queryString.set("search", this.props.searchValue);
    this.props.history.push(
      window.location.pathname + "?" + queryString.toString()
    );
    const { lat, lng } = this.state.coords;
    this.setState({ loading: true });
    window.setTimeout(() => this.setState({ loading: false }), 5000);
    let ok;
    window
      .fetch(
        searchCoords() +
          "?query=" +
          (this.props.searchValue === "" ? "food" : this.props.searchValue) +
          "&lat=" +
          lat +
          "&lng=" +
          lng +
          "&range=" +
          this.state.range +
          (map ? "&view=map" : ""),
        {
          method: "GET",
          mode: "cors",
        }
      )
      .then((result) => {
        ok = result.ok;
        return result.json();
      })
      .then((response) => {
        if (!ok) {
          throw new Error(response.error);
        }
        return response;
      })
      .then(
        (data) => {
          if (override) {
            let on = Object.fromEntries(
              this.state.on.map((r) => [r.restID, r])
            );
            let off = Object.fromEntries(
              this.state.off.map((r) => [r.restID, r])
            );
            data.on.forEach((r) => {
              on[r.restID] = r;
            });
            data.off.forEach((r) => {
              off[r.restID] = r;
            });
            this.setState({
              loading: false,
              on: Object.values(on),
              off: Object.values(off),
            });
          } else {
            this.setState({
              loading: false,
              on: data.on,
              off: data.off,
            });
          }
        },
        (error) => console.log(error)
      );
  }

  mapSearch(map) {
    const range = (map.getBounds().toSpan().lat() * 69) / 2; // Diameter in latitude -> diameter in miles -> radius in miles
    this.setState({ coords: map.center.toJSON(), range });
    this.searchRestaurants(true, true);
  }

  componentDidUpdate(prevProps) {
    if (
      Object.keys(this.state.coords).length > 0 &&
      prevProps.searchValue !== this.props.searchValue
    ) {
      this.searchRestaurants();
    }
  }

  render() {
    const list = [
      ...this.state.on.map((obj) => {
        return { ...obj, on: true };
      }),
      ...this.state.off.map((obj) => {
        return { ...obj, on: false };
      }),
    ];

    const classes = this.props.classes;
    return (
      <React.Fragment>
        <TabPanel index="list" tabValue={this.props.tabValue}>
          <ConditionalRender
            condition={() =>
              this.state.on.length > 0 || this.state.off.length > 0
            }
            alt={
              <Paper className={classes.paper} style={{ marginTop: "5%" }}>
                {!this.state.loading ? (
                  <Typography align="center" variant="h5">
                    No Search Results
                  </Typography>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <Spinner />
                  </div>
                )}
              </Paper>
            }
          >
            <Grid
              container
              spacing={3}
              style={{ margin: "0", marginTop: "3%" }}
            >
              <Grid
                container
                spacing={2}
                item
                xs={12}
                lg={6}
                alignContent="flex-start"
              >
                <Grid item xs={12}>
                  <Typography
                    align="center"
                    variant="h5"
                    style={{ marginBottom: "7px" }}
                  >
                    Gift Cards Available
                  </Typography>
                  <Divider light />
                </Grid>
                {this.state.on.map((data) => (
                  <Grid item xs={12} sm={6}>
                    <RestaurantCard
                      signedIn={this.props.signedIn}
                      supported
                      classes={classes}
                      data={data}
                    />
                  </Grid>
                ))}
              </Grid>
              <Divider
                orientation="vertical"
                light
                flexItem
                style={{ marginTop: "52px" }}
              />
              <Grid
                container
                spacing={2}
                item
                xs={12}
                lg={6}
                alignContent="flex-start"
              >
                <Grid item xs={12}>
                  <Typography
                    align="center"
                    variant="h5"
                    style={{ marginBottom: "7px" }}
                  >
                    Not Yet Supported
                  </Typography>
                  <Divider light />
                </Grid>
                {this.state.off.map((data) => (
                  <Grid item xs={12} sm={6}>
                    <RestaurantCard classes={classes} data={data} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </ConditionalRender>
        </TabPanel>
        <TabPanel index="map" tabValue={this.props.tabValue}>
          <GoogleMapsContainer
            signedIn={this.props.signedIn}
            coords={this.state.coords}
            mapSearch={this.mapSearch.bind(this)}
            list={list}
          />
          <ConditionalRender
            condition={() => {
              return this.state.loading;
            }}
          >
            <Box
              style={{
                textAlign: "center",
                position: "absolute",
                right: "40%",
                bottom: "10px",
                zIndex: 10,
              }}
            >
              <Card style={{ padding: 10, paddingLeft: 30, paddingRight: 30 }}>
                <Spinner></Spinner>
              </Card>
            </Box>
          </ConditionalRender>
        </TabPanel>
        <Snackbar
          open={!!this.state.error}
          autoHideDuration={6000}
          style={{ maxWidth: 700, width: "100%" }}
          onClose={(_, r) => {
            if (r !== "clickaway") this.setState({ error: false });
          }}
        >
          <Alert
            variant="filled"
            onClose={(_, r) => {
              if (r !== "clickaway") this.setState({ error: false });
            }}
            severity="error"
            style={{ width: "100%", fontSize: "1.5rem" }}
          >
            <AlertTitle style={{ fontSize: "1.5rem" }}>Error</AlertTitle>
            {this.state.error}
          </Alert>
        </Snackbar>
      </React.Fragment>
    );
  }
}

function Content(props) {
  const { classes, tabValue, signedIn, history, searchValue } = props;

  return (
    <MainView
      classes={classes}
      signedIn={signedIn}
      tabValue={tabValue}
      history={history}
      searchValue={searchValue}
    />
  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  tabValue: PropTypes.string.isRequired,
  signedIn: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  searchValue: PropTypes.string.isRequired,
};

export default withStyles(styles)(Content);
