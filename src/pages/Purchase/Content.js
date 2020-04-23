import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { withStyles } from '@material-ui/core/styles';
import { Spinner } from '../common';
import { restGetDetails, userBuy, login, restGetPhoto } from '../../endpoints';
import {
  Typography,
  Paper,
  Divider, 
  Button, 
  ButtonGroup,
  IconButton,
  GridList,
  Grid,
} from '@material-ui/core'

import {
  ExpandMore,
} from '@material-ui/icons'

const styles = (theme) => ({
  paper: {
    borderRadius: '10px',
    maxWidth: 800,
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

class PurchaseContent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: {},
      amount: 30
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
    const { restId } = this.props.match.params

    try {
      this.setState({data: await this.checkBackend(restGetDetails() + "?restId=" + restId)});
    } catch (err) {
      console.log(err);
      this.setState({data: { error: "Sorry, could not load restaurant info" }})
    }
  }
  
  render() {
    const [ minAmount, medAmount, maxAmount ] = [ 20, 30, 50 ];
    const { classes } = this.props;
    const data = this.state.data;
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
            <GridList cols={3}>
              {data.customPhotos && data.customPhotos.map(url => <img alt="team" src={url} />)}
            </GridList>
            {data.hasOwnProperty("customPhotos") && data.customPhotos === null && data.image &&
             <img alt="restaurant" src={data.image ? restGetPhoto() + `?photoreference=${data.image}` : 
              process.env.PUBLIC_URL + "/img/none.jpg"}></img>}
          </Grid>
          <Grid item xs={12}><Typography variant="body2">{data.description}</Typography></Grid>
          <Grid item container xs={12} spacing={3} alignItems="center">
            <Grid item>
              <Typography variant="body1" >Purchase Amount: </Typography>
            </Grid>
            <Grid item>
              <ButtonGroup color="primary" size="large" orientation='horizontal'>
                <Button onClick={() => this.setState({amount: minAmount})}>${minAmount}</Button>
                <Button onClick={() => this.setState({amount: medAmount})}>${medAmount}</Button>
                <Button onClick={() => this.setState({amount: maxAmount})}>${maxAmount}</Button>
              </ButtonGroup>
            </Grid>
            <Grid item>
              <Button color="secondary" variant="contained" size = "large"
                onClick={() => {
                  const link = userBuy() + "?restId=" + this.props.match.params.restId + "&amount=" + 
                    this.state.amount * 100;
                  if (!this.props.signedIn) {
                    Cookies.set("signed_in", "1")
                    window.location.assign(login("user") + "?redirect=" + link.replace("&", "%26"));
                  } else {
                    window.location.assign(link);
                  }
                }}>Buy ${this.state.amount} Card</Button>
            </Grid>
          </Grid>
          <Grid item xs={12}><Divider style={{backgroundColor: "rgba(0,0,0,0.28)"}}/></Grid>
          <Grid item xs={12}>
            <Typography variant="body2" style={{fontSize: '1rem'}}>
              By purchasing a gift card to <strong>{data.name}</strong>, you are providing them essential support in
              surviving and mitigating the worst economic circumstances ever to hit the service industry. Your help
              especially benefits the tens of thousands of staff members whose jobs are currently at risk, because 
              <strong> 25% of your purchase</strong> is given directly to the {data.name} team as a gift. It is up to
              the establishment to decide how the other 75% translates into menu items, but you can be assured that your
              contribution is immensely appreciated.
            </Typography>
          </Grid>
        </Grid>
      }
      </Paper>
    )
  }
  
}

function Content(props) {
  const { classes, tabValue, match } = props;

  return (
  <React.Fragment>
    <TabPanel index="purchase" tabValue={tabValue}>
      <PurchaseContent classes={classes} match={match}/>
    </TabPanel>
  </React.Fragment>
  )
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  tabValue: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(Content);
