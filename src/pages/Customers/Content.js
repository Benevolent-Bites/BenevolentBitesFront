import React from 'react';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ConditionalRender, Spinner } from '../common';
import { Route, Switch, Link } from 'react-router-dom';
import { userGetInfo, userSetInfo, squareSignup, userGetCards, restGetDetails, frontUrl } from '../../endpoints';
import {
  Typography,
  Paper,
  Card,
  CardMedia,
  Dialog,
  Divider,
  DialogTitle,
  CardActionArea,
  CardActions,
  CardContent,
  Collapse,
  CardHeader,
  Box,
  Grid,
  Container,
  Hidden,
  Button,
  IconButton,
  TextField,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListItem,
  Tooltip,
  Checkbox
} from '@material-ui/core'

import {
  CheckRounded,
  CloseRounded,
  AddRounded,
  ExpandMore,
  ExitToAppRounded
} from '@material-ui/icons'

import QRCode from 'qrcode.react';

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

class AddInfo extends React.Component {
  constructor (props) {
    super(props);
    this.state={
      submitMessage: ""
    }
  }

  componentDidMount() {
    if (this.props.info && Object.keys(this.props.info).length == 0) {
      let ok;
      window.fetch(
        userGetInfo(),
        {mode: 'cors', method: 'GET', cache: 'no-cache', credentials: 'include'}
      ).then(result => {
        ok = result.ok;
        return result.json()
      }).then(response => {
        if(!ok) {throw new Error(response.error)}
        return response
      }).then(
        info => {this.props.setInfo(info)},
        error => console.log(error)
      )
    }
  }

  updateInfo (event) {
    this.props.setInfo({
      ...this.props.info,
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { classes, info } = this.props;
    const updateInfo = this.updateInfo.bind(this);

    return(
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
            Enter Your Billing Information Below:
        </Typography>
        <Grid container spacing={3} className={classes.formGrid}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              variant="outlined"
              id="name"
              name="name"
              label="Name"
              value={info.name || ''}
              fullWidth
              onChange={updateInfo}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              variant="outlined"
              id="city"
              name="city"
              label="City"
              fullWidth
              autoComplete="billing address-level2"
              value={info.city || ''}
              onChange={updateInfo}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              variant="outlined"
              id="address"
              name="address"
              label="Address line 1"
              fullWidth
              autoComplete="billing address-line1"
              value={info.address || ''}
              onChange={updateInfo}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              required 
              variant="outlined" 
              id="state" 
              name="state" 
              label="State/Province/Region"
              autoComplete="billing address-level1"
              fullWidth
              value={info.state || ''}
              onChange={updateInfo}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              variant="outlined"
              id="zip"
              name="zip"
              label="Zip / Postal code"
              fullWidth
              autoComplete="billing postal-code"
              value={info.zip || ''}
              onChange={updateInfo}
            />
          </Grid>
        </Grid>
        <Grid className={classes.submitButton} container direction="row" alignItems="center">
          <Button
            type="submit" onClick={() => {
              window.fetch(
                userSetInfo(),
                {
                  mode: 'cors',
                  credentials: 'include',
                  method: 'POST',
                  body: JSON.stringify(info)
                }
              ).then((result) => {
                if (result.ok) {
                  this.setState({submitMessage: "Submitted Successfully."});
                } else {
                  this.setState({submitMessage: "Error, please try again later."});
                }
              });
            }}
            variant="contained"
            color="primary"
            size="large">Submit</Button>
          <Grid item>
            <Typography style={{marginLeft: '20px', fontSize: '1.2rem'}}>{this.state.submitMessage}</Typography>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

class GiftCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      details: null,
      expanded: false
    };
  }

  handleExpandClick () {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  getRestaurant (id) {
    let ok;
    return window.fetch(
      restGetDetails() + "?restId=" + id,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      }
    ).then(result => {
      ok = result.ok;
      return result.json()
    }).then(response => {
      if (!ok) {
        throw new Error(response.error);
      }
      return response
    }).catch(
      error => console.log(error)
    );
  }

  async componentDidMount () {
    const details = await this.getRestaurant(this.props.card.restaurant);
    this.setState({
      details: details
    });
  }

  formatTime (timestamp) {
    const dateOptions = {dateStyle: 'full', timeStyle: 'short', timeZoneName: 'short'};
    let output = "";
    try {
      output = new Intl.DateTimeFormat('en-us', dateOptions).format(new Date(timestamp));
    } catch(err) {
      console.log(err);
      output = timestamp;
    }
    return output
  }

  render () {
    const { classes, card, handleQR } = this.props;
    const details = this.state.details;
    if (!details) {
      return <React.Fragment><Typography>Could not load restaurant info. <br/> 
          Balance: {card.balance} <br/></Typography></React.Fragment>
    }
    return(
      <Card>
        <CardHeader title={details.name}/>
        <CardMedia component="img" height="120" image={process.env.PUBLIC_URL + "/img/giftcard.jpg"}/>
        <CardContent><Typography variant="h6">Balance: ${card.balance / 100}</Typography></CardContent>
        <CardActions disableSpacing>
          <Button color="primary" variant="outlined" onClick={() => handleQR(card.uuid)}>QR CODE</Button>
          <Button onClick={() => this.handleExpandClick()} style={{marginLeft: 'auto'}} endIcon={<ExpandMore
              className={clsx(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}/>
            }>Card History</Button>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Divider style={{backgroundColor: 'rgba(0,0,0,0.13)'}} />
          <CardContent>
            <List>
              {card.transactions.map((transaction) => (
                <ListItem dense divider key={transaction.paymentId}>
                  <ListItemText disableTypography>
                    <Typography variant="body">{this.formatTime(transaction.timestamp)}</Typography>
                  </ListItemText>
                  <ListItemText disableTypography>
                    <Typography variant="body">${transaction.amount / 100}</Typography>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Collapse>
      </Card>
    )
  }
}

function MyCards (props) {
  const { classes, cards, setCards } = props;
  const [dialogContents, setDialogContents] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  if (cards && cards.length == 0) {
    let ok;
    window.fetch(
      userGetCards(),
      {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache'
      }
    ).then(result => {
      ok = result.ok;
      return result.json()
    }).then(response => {
      if (!ok) {
        throw new Error(response.error);
      }
      return response
    }).then(
      data => setCards(data.length > 0 ? data : null),
      error => {console.log(error); setCards(null)}
    )
    return <Paper className={classes.paper}><Spinner style={{margin: 'auto'}}/></Paper>
  } else if (!cards) {
    return (<Paper className={classes.paper}>
      <span style={{display: 'flex', width: '50%'}}>
        <Typography style={{marginRight: '20px'}}>You have no cards yet.</Typography>
        <Button variant="outlined" component={Link} to="/" color="primary">Get Started</Button>
      </span>
    </Paper>)
  }

  const handleQR = (id) => {
    setDialogContents(<React.Fragment>
      <DialogTitle style={{margin: 'auto'}}>Card Id: {id}</DialogTitle>
      <QRCode renderAs="svg" level='M' includeMargin style={{margin: 'auto', width:'100%', height: '100%'}} 
        value={frontUrl() + "/redeem?id=" + id} size={300} />
    </React.Fragment>);
    setDialogOpen(true);
  }

  const handleClose = () => {
    setDialogOpen(false);
  }
  
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {cards.map(card => <Grid item xs={12} sm={4}>
          <GiftCard key={card.id} card={card} classes={classes} handleQR={handleQR}/>
        </Grid>)}
      </Grid>
      <Dialog maxWidth='sm' fullWidth open={dialogOpen} onClose={handleClose}>{dialogContents}</Dialog>
    </React.Fragment>
  )
}

class Homepage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      list: {
          addInfo: {name: <Typography>Add Your Information</Typography>, value: <ListItemIcon><Spinner/></ListItemIcon>},
          getCards: {name: <Typography>Get Cards</Typography>, value: <ListItemIcon><Spinner/></ListItemIcon>}
      }
    }
  }

  checkBackend (url, key) {
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

  displayResult(key, data, component="link") {
    let item = this.state.list[key];
    const componentMap = {
      "a": "a",
      "link": Link
    };
    const linkMap = {
      "a": "href",
      "link": "to"
    };
    item.value = data.link && <ListItemSecondaryAction>
      <Button component={componentMap[component]} {...{[linkMap[component]]: data.link}} style={{textTransform: 'none'}}
        endIcon={<AddRounded style={{ marginRight: '6px', marginLeft: 'none', color: 'blue', fontSize: 40}} />}>
        <Hidden smDown><Typography className={this.props.classes.resultText}>{data.text}</Typography></Hidden>
      </Button>
    </ListItemSecondaryAction>
    this.setState({
      list: {
        ...this.state.list,
        [key]: item
      }
    });
  }

  displayError (key, msg) {
    let item = this.state.list[key];
    item.value = <React.Fragment>
        <Typography className={this.props.classes.resultText}>{msg}</Typography>
        <ListItemIcon>
          <CloseRounded style={{ color:"red", fontSize: 40 }} />
        </ListItemIcon>
      </React.Fragment>
    this.setState({
      list: {
        ...this.state.list,
        [key]: item
      }
    });
  }

  displayDone (key, msg = "Done!") {
    let item = this.state.list[key];
    item.value = <React.Fragment>
      <Hidden smDown><Typography className={this.props.classes.resultText}>{msg}</Typography></Hidden>
      <ListItemIcon>
        <CheckRounded style={{ color: "green", fontSize: 40 }} />
      </ListItemIcon>
    </React.Fragment>
    this.setState({
      list: {
        ...this.state.list,
        [key]: item
      }
    });
  }

  checkItems(key) {
    const itemsDict = {
      addInfo: () => {
        if (Object.keys(this.props.info).length == 0) {
          this.checkBackend(userGetInfo()).then(
            (info) => {
              if (info["name"]) {
                this.props.setInfo(info);
                this.displayDone("addInfo", 
                  <React.Fragment>
                    Done!
                    <Button style={{marginLeft: '15px'}} variant="outlined" size="small" 
                      component={Link} to="/users/info">Update Info</Button>
                  </React.Fragment>);
              } else {
                this.props.setInfo(info);
                this.displayResult("addInfo", {text: "Get Started", link: "/users/info"}, "link");
              }
            },
            error => {
              console.log(error);
              this.displayError("addInfo", "Please log in again.");
            }
          )
        } else {
          if (this.props.info["name"]) {
            this.displayDone("addInfo", 
              <React.Fragment>
                Done!
                <Button style={{marginLeft: '15px'}} variant="outlined" size="small" 
                  component={Link} to="/users/info">Update Info</Button>
              </React.Fragment>);
          } else {
            this.displayResult("addInfo", {text: "Get Started", link: "/users/info"}, "link");
          }
        }
      },
      getCards: () => {
        if (this.props.cards && this.props.cards.length === 0) {
          this.checkBackend(userGetCards()).then(
            cards => {
              if (cards.length > 0) {
                this.props.setCards(cards);
                this.displayDone("getCards", 
                  <React.Fragment>
                    Done!
                    <Button style={{marginLeft: '15px'}} variant="outlined" size="small" 
                      component={Link} to="/users/cards">See Cards</Button>
                  </React.Fragment>);
              } else {
                this.props.setCards(null);
                this.displayResult("getCards", {text: "Get Started", link: "/"}, "link");
              }
            },
            error => {
              console.log(error);
              this.props.setCards(null);
              this.displayError("addInfo", "Please log in again.");
            }
          )
        } else {
          if (this.props.cards) {
            this.displayDone("getCards", <React.Fragment>
                Done!
              <Button style={{marginLeft: '15px'}} variant="outlined" size="small" 
                component={Link} to="/users/cards">See Cards</Button>
            </React.Fragment>);
          }
          else {
            this.displayResult("getCards", {text: "Get Started", link: "/"}, "link");
          }
        }
      }
    };
    itemsDict[key]();
  }

  componentDidMount() {
    for (let key in this.state.list) {
      this.checkItems(key);
    }
  }

  render() {
    const classes = this.props.classes;
    return (
      <Paper className={classes.paper}>
        <Typography align="center" variant="h4">Dashboard</Typography>
        <List component="nav">
          {Object.entries(this.state.list).map(([key,{name, value}]) => (
            <ListItem divider key={key}>
              <ListItemText primary={name} className={classes.homepageListText}/>
              {value}
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
}

function Content(props) {
  const { classes, tabValue, info, setInfo } = props;

  const [cards, setCards] = React.useState([]);

  return (
  <React.Fragment>
    <TabPanel index="dashboard" tabValue={tabValue}>
      <Homepage classes={classes} setInfo={setInfo} info={info} cards={cards} setCards={setCards}/>
    </TabPanel>
    <TabPanel index="info" tabValue={tabValue}>
      <AddInfo classes={classes} setInfo={setInfo} info={info}/>
    </TabPanel>
    <TabPanel index="cards" tabValue={tabValue}>
      <MyCards classes={classes} cards={cards} setCards={setCards}/>
    </TabPanel>
  </React.Fragment>
  )
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  tabValue: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  setInfo: PropTypes.func.isRequired
};

export default withStyles(styles)(Content);
