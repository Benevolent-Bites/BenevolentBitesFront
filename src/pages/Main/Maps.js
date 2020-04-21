import React from "react";
import ReactDOM from "react-dom";
import { GoogleApiWrapper, InfoWindow, Map, Marker } from "google-maps-react";
import { withStyles } from "@material-ui/core/styles";
import RestaurantCard from "./RestaurantCard";

const styles = (theme) => ({
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
});

class InfoWindowEx extends React.Component {
  constructor(props) {
    super(props);
    this.infoWindowRef = React.createRef();
    this.contentElement = document.createElement("div");
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      ReactDOM.render(
        React.Children.only(this.props.children),
        this.contentElement
      );
      this.infoWindowRef.current.infowindow.setContent(this.contentElement);
    }
  }

  render() {
    return <InfoWindow ref={this.infoWindowRef} {...this.props} />;
  }
}

class GoogleMapsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      place: {},
    };
    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      place: props.place,
      showingInfoWindow: true,
    });
  };

  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  onExpandClick(expanded) {
    this.setState({ expanded: !expanded });
  }

  render() {
    const style = {
      width: "100%",
      height: "100vh",
      marginLeft: "auto",
      marginRight: "auto",
    };
    const containerStyle = {
      width: "100%",
      height: "100%",
      position: "relative",
    };
    return (
      <Map
        item
        xs={12}
        style={style}
        containerStyle={containerStyle}
        google={this.props.google}
        onClick={this.onMapClick}
        zoom={Object.keys(this.props.coords).length == 0 ? 4 : 14}
        initialCenter={{
          lat: 30.27379,
          lng: -97.80073,
        }}
        center={this.props.coords}
      >
        {this.props.list.map((place) => (
          <Marker
            position={{ lat: place.latitude, lng: place.longitude }}
            name={place.title}
            title={place.title}
            onClick={this.onMarkerClick}
            place={place}
            icon={
              place.on
                ? null
                : { url: process.env.PUBLIC_URL + "/img/greymarker.png" }
            }
          />
        ))}
        <InfoWindowEx
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          {Object.keys(this.state.place).length > 0 && (
            <RestaurantCard
              map
              signedIn={this.props.signedIn}
              data={this.state.place}
              supported={this.state.place.on}
              classes={this.props.classes}
            />
          )}
        </InfoWindowEx>
      </Map>
    );
  }
}

export default withStyles(styles)(
  GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API,
  })(GoogleMapsContainer)
);
