import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Spinner } from "../common";
import { Link } from "react-router-dom";
import { userGetCards, restGetDetails, frontUrl, restGetPhoto } from "../../endpoints";
import {
  Typography,
  Paper,
  Card,
  CardMedia,
  Dialog,
  CardActionArea,
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
} from "@material-ui/core";
import * as Colors from "../Colors";

import { ExpandMore } from "@material-ui/icons";

import QRCode from "qrcode.react";

const styles = (theme) => ({
  paper: {
    borderRadius: "10px",
    maxWidth: 936,
    margin: "auto",
    padding: theme.spacing(3.4),
    overflow: "hidden",
    "& p": {
      fontSize: "1.3rem",
    },
    backgroundColor: Colors.TextRegular,
    color: Colors.White,
  },
  expand: {
    transform: "rotate(0deg)",
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
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
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
});

function TabPanel(props) {
  const { children, tabValue, index } = props;
  return index === tabValue && children;
}

class GiftCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: null,
      expanded: false,
    };
  }

  handleExpandClick() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  getRestaurant(id) {
    let ok;
    return window
      .fetch(restGetDetails() + "?restId=" + id, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      })
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
      .catch((error) => console.log(error));
  }

  async componentDidMount() {
    if (this.props.card.details) {
      this.setState({
        details: this.props.card.details,
      });
      return;
    }
    const details = await this.getRestaurant(this.props.card.restaurant);
    this.setState({
      details: details,
    });
    this.props.updateCard({ ...this.props.card, details });
  }

  formatTime(timestamp) {
    const dateOptions = {
      dateStyle: "full",
      timeStyle: "short",
      timeZoneName: "short",
    };
    let output = "";
    try {
      output = new Intl.DateTimeFormat("en-us", dateOptions).format(
        new Date(timestamp)
      );
    } catch (err) {
      console.log(err);
      output = timestamp;
    }
    return output;
  }

  render() {
    const { classes, card, handleQR } = this.props;
    const details = this.state.details;
    return (
      <Card>
        <CardHeader
          title={details && details.name}
          subheader={details && details.address}
        />
        <CardActionArea component="a" href={`/purchase/${this.props.card.restaurant}`} target="_blank"><CardMedia
          component="img"
          height="120"
          image={details && details.image ? restGetPhoto() + "?photoreference=" + details.image : 
            process.env.PUBLIC_URL + "/img/giftcard.jpg"}
        /></CardActionArea>
        <CardContent>
          <Typography variant="h6">Balance: ${card.balance / 100}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleQR(card.uuid)}
          >
            QR CODE
          </Button>
          <Button
            onClick={() => this.handleExpandClick()}
            style={{ marginLeft: "auto" }}
            endIcon={
              <ExpandMore
                className={clsx(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
              />
            }
          >
            Card History
          </Button>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Divider style={{ backgroundColor: "rgba(0,0,0,0.13)" }} />
          <CardContent>
            <List>
              {card.transactions.map((transaction) => (
                <ListItem dense divider key={transaction.paymentId}>
                  <ListItemText disableTypography>
                    <Typography variant="body2">
                      {this.formatTime(transaction.timestamp)}
                    </Typography>
                  </ListItemText>
                  <ListItemText disableTypography>
                    <Typography
                      variant="body1"
                      style={{
                        color: transaction.amount > 0 ? "green" : "red",
                      }}
                    >
                      ${transaction.amount / 100}
                    </Typography>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

function MyCards(props) {
  const { classes, cards, setCards } = props;
  const [dialogContents, setDialogContents] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  if (cards && cards.length === 0) {
    let ok;
    window
      .fetch(userGetCards(), {
        method: "GET",
        credentials: "include",
        mode: "cors",
        cache: "no-cache",
      })
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
        (data) => setCards(data.length > 0 ? data : null),
        (error) => {
          console.log(error);
          setCards(null);
        }
      );
    return (
      <Paper className={classes.paper}>
        <div style={{textAlign: 'center'}}><Spinner/></div>
      </Paper>
    );
  } else if (!cards) {
    return (
      <Paper className={classes.paper}>
        <span style={{ display: "flex", width: "50%" }}>
          <Typography style={{ marginRight: "20px" }}>
            You have no cards yet.
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            to="/"
            style={{ color: Colors.White }}
          >
            Get Started
          </Button>
        </span>
      </Paper>
    );
  }

  const handleQR = (id) => {
    setDialogContents(
      <React.Fragment>
        <DialogTitle style={{ margin: "auto" }}>Card Id: {id}</DialogTitle>
        <QRCode
          renderAs="svg"
          level="M"
          includeMargin
          style={{ margin: "auto", width: "100%", height: "100%" }}
          value={frontUrl() + "/redeem?id=" + id}
          size={300}
        />
      </React.Fragment>
    );
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const updateCard = (idx, card) => {
    cards[idx] = card;
    setCards(cards);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {cards.map((card, idx) => (
          <Grid item xs={12} sm={4}>
            <GiftCard
              key={card.id}
              card={card}
              updateCard={(data) => updateCard(idx, data)}
              classes={classes}
              handleQR={handleQR}
            />
          </Grid>
        ))}
      </Grid>
      <Dialog maxWidth="sm" fullWidth open={dialogOpen} onClose={handleClose}>
        {dialogContents}
      </Dialog>
    </React.Fragment>
  );
}

function Content(props) {
  const { classes, tabValue, cards, setCards } = props;

  return (
    <React.Fragment>
      <TabPanel index="cards" tabValue={tabValue}>
        <MyCards classes={classes} cards={cards} setCards={setCards} />
      </TabPanel>
    </React.Fragment>
  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  tabValue: PropTypes.string.isRequired,
};

export default withStyles(styles)(Content);
