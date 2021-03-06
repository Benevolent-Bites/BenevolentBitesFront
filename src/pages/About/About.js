import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import Header from "./Header";
import * as Colors from "../Colors";

const styles = (theme) => ({
  paper: {
    borderRadius: "10px",
    maxWidth: 936,
    margin: "auto",
    marginTop: "10%",
    padding: theme.spacing(3.4),
    overflow: "hidden",
    "& p": {
      fontSize: "1.3rem",
    },
    position: "relative",
    background: Colors.TextRegular,
    color: Colors.White,
  },
  app: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    //alignItems: "center",
    justifyContent: "center",
    verticalAlign: "center",
  },
  main: {
    flex: 1,
    background: Colors.LightBackground,
  },
  formGrid: {
    marginTop: theme.spacing(3),
  },
  searchInput: {
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
});

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
    };
  }

  async componentDidMount() {
    const content = await window
      .fetch(process.env.PUBLIC_URL + "/about.txt")
      .then((result) => result.text());
    document.getElementById("paper").innerHTML = content;
  }

  render() {
    const { classes, handleDrawerToggle } = this.props;
    return (
      <div className={classes.app}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <main className={classes.main}>
          <Paper
            className={classes.paper}
            id="paper"
            style={{ color: Colors.White }}
          ></Paper>
        </main>
      </div>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
