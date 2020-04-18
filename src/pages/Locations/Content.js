import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Spinner } from '../common';
import { restSetLocation, restGetLocations, frontUrl } from '../../endpoints';
import {
  Typography,
  Paper,
  Button,
  List,
  ListItemSecondaryAction,
  ListItemText,
  ListItem,
} from '@material-ui/core'

const styles = (theme) => ({
  paper: {
    borderRadius: '10px',
    maxWidth: 936,
    margin: 'auto',
    padding: theme.spacing(3.4),
    overflow: 'hidden',
    '& p': {
      fontSize: '1.3rem'
    }
  },
  formGrid: {
    marginTop: theme.spacing(3)
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
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
  }
});

function TabPanel(props) {
  const { children, tabValue, index } = props;
  return (
    index === tabValue && children
  )
}

class Homepage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      locations: null
    }
  }

  checkBackend (url) {
    let ok;
    return (
      window.fetch(
        url,
        {
          method: 'GET',
          credentials: 'include',
          mode: 'cors',
          cache: 'no-cache'
        }
      )
      .then(result => {
        ok = result.ok;
        return result.json();
      }).then(response => {
        if (!ok) {
          throw new Error(response.error);
        }
        return response
      })
    )
  }

  async componentDidMount() {
    let locations = await this.checkBackend(restGetLocations()).catch(err => console.log(err));
    this.setState({locations: locations || [{name: "Could not find any locations..."}]});
  }

  async setLocation(id) {
    let result = await this.checkBackend(restSetLocation() + "?id=" + id).catch(err => console.log(err));
    window.location.assign(frontUrl() + "/restaurants?square=" + (result ? "success" : "fail"))
  }

  render() {
    const classes = this.props.classes;
    return (
      <Paper className={classes.paper}>
        <Typography align="center" variant="h4">Choose Your Location:</Typography>
        <List component="nav">
          {this.state.locations ? this.state.locations.map(({id, name, address, description}) => (<React.Fragment>
            <ListItem divider key={id}>
              <ListItemText primary={name} secondary={address} primaryTypographyProps={{variant: "h5"}}
                secondaryTypographyProps={{variant: "body1"}} />
              <ListItemSecondaryAction>
                <Button variant="outlined" color="secondary" onClick={() => this.setLocation(id)}>
                  Choose</Button>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem key={id + "_description"}>
              <ListItemText inset primary={description}/>
            </ListItem>
          </React.Fragment>)) : <Spinner />}
        </List>
      </Paper>
    );
  }
}

function Content(props) {
  const { classes } = props;

  return (
    <TabPanel index="locations" tabValue="locations">
      <Homepage classes={classes}/>
    </TabPanel>
  )
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  tabValue: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  setInfo: PropTypes.func.isRequired
};

export default withStyles(styles)(Content);
