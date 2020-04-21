import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Spinner } from '../common';
import { Link } from 'react-router-dom';
import { userGetCards, restGetDetails, frontUrl, restGetPhoto } from '../../endpoints';
import {
  Typography,
  Paper,
  Card,
  CardMedia,
  Dialog,
  Divider,
  DialogTitle,
  CardActions,
  CardContent,
  Collapse,
  CardHeader,
  Grid,
  Button,
  List,
  ListItemText,
  ListItem,
} from '@material-ui/core'

import {
  ExpandMore,
} from '@material-ui/icons'

const styles = (theme) => ({
  paper: {
    borderRadius: '10px',
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3.4),
    overflow: 'hidden',
    '& p': {
      fontSize: '1.3rem'
    }
  },
  expand: {
    transform: 'rotate(0deg)',
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

class ReferContent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  checkBackend (url, method="GET", body=null, credentials='include') {
    let ok;
    return window.fetch(
      url,
      {
        method,
        body: body && JSON.stringify(body),
        mode: 'cors',
        credentials
      }
    ).then((res) => {
      ok = res.ok;
      return res.json()
    }).then((res) => {
      if (!ok) {
        throw new Error(res.error)
      }
      return res
    })
  }

  async componentDidMount() {
    const queryString = new URLSearchParams(window.location.search);
    const placeID = queryString.get("pid");

    try {
      this.setState({data: await this.checkBackend(restGetDetails() + "?restId=" + placeID)});
    } catch (err) {
      console.log(err);
      this.setState({data: { error: "Sorry, could not load restaurant info" }})
    }
  }
  
  render() {
    const { classes } = this.props;
    const data = this.state.data;
    console.log(data);
    return (
      <Paper className={classes.paper}>
      {Object.keys(data).length === 0 ?
        <Spinner /> :
        data.error ? <Typography>{data.error}</Typography> :
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">{data.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{data.address}</Typography>
          </Grid>
          <Grid item xs={12}>
            <img alt="restaurant" src={data.image ? 
              restGetPhoto() + "?photoreference=" + data.image : process.env.PUBLIC_URL + "/img/none.jpg"} />
          </Grid>
          <Grid item container xs={12} spacing={3}>
            <Grid item xs={3}>
              <Button disabled={!data.phone} variant="contained" color="primary" component="a" 
                href={data.phone && "tel:+" + data.phone.replace(" ", "")}>Call Now</Button>
            </Grid>
            <Grid item xs={4}>
              <Button disabled={!data.website} variant="outlined" color="primary" component="a" 
                href={data.website}>Visit Website</Button>
            </Grid>
            {(!data.website && !data.phone) && <Grid item xs={4}>
              <Typography variant="body2">Sorry, could not find contact info</Typography></Grid>}
          </Grid>
          <Grid item xs={12}><Divider style={{backgroundColor: "rgba(0,0,0,0.28)"}}/></Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              Please contact this restaurant using their phone number or website above, and ask them to check out our 
              platform. If neither are available, feel free to reach out another way. <br/><br/>
              Thank you for supporting your community and the Benevolent Bites Project!
            </Typography>
          </Grid>
        </Grid>
      }
      </Paper>
    )
  }
  
}

function Content(props) {
  const { classes, tabValue } = props;

  return (
  <React.Fragment>
    <TabPanel index="refer" tabValue={tabValue}>
      <ReferContent classes={classes} />
    </TabPanel>
  </React.Fragment>
  )
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  tabValue: PropTypes.string.isRequired,
};

export default withStyles(styles)(Content);
