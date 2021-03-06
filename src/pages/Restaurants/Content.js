import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Spinner } from "../common";
import { Link } from "react-router-dom";
import {
  restGetInfo,
  restSetInfo,
  squareSignup,
  restSetPassword,
  restPublish,
  restVerifyCall,
  restVerifyCode,
  restContract,
  restAddPhotos,
} from "../../endpoints";
import {
  Typography,
  Paper,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Hidden,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListItem,
  withWidth,
  useMediaQuery,
} from "@material-ui/core";

import {
  CheckRounded,
  CloseRounded,
  AddRounded,
  DeleteRounded,
} from "@material-ui/icons";

import Data from "./Data";
import * as Colors from "../Colors";

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
    marginTop: "6%",
    backgroundColor: Colors.TextRegular,
    color: Colors.White,
  },
  formGrid: {
    marginTop: theme.spacing(3),
    color: Colors.White,
  },
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  searchInput: {
    color: Colors.White,
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
    color: Colors.Background,
  },
  logoutButton: {
    marginTop: theme.spacing(2),
  },
  resultText: {
    marginRight: theme.spacing(2),
  },
  titleBar: {
    background: "rgba(0,0,0,0)",
  },
  cssLabel: {
    color: Colors.White,
    "& label.Mui-focused": {
      color: "white",
    },
  },
  cssOutlinedInput: {
    borderColor: Colors.White,
    color: Colors.White,
  },
  cssFocused: {
    borderColor: Colors.White,
    color: Colors.White,
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "white !important",
  },
});

function TabPanel(props) {
  const { children, tabValue, index } = props;
  return index === tabValue && children;
}

function AddInfo(props) {
  const { classes, info, setInfo } = props;
  const [submitMessage, setSubmitMessage] = React.useState();
  const [photoSubmitMessage, setPhotoSubmitMessage] = React.useState();
  const [photos, setPhotos] = React.useState({});
  React.useEffect(() => {
    setPhotos(
      info.photos
        ? Object.fromEntries(
            info.photos.map((p) => [p, { name: p, old: true }])
          )
        : {}
    );
  }, [info.photos]);
  const [deleted, setDeleted] = React.useState([]);
  const wide = useMediaQuery("(min-width:960px)");

  function updateInfo(event) {
    setInfo({
      ...info,
      [event.target.name]: event.target.value,
    });
  }

  if (info && Object.keys(info).length === 0) {
    let ok;
    window
      .fetch(restGetInfo(), {
        mode: "cors",
        method: "GET",
        cache: "no-cache",
        credentials: "include",
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
        (info) => {
          setInfo(info);
        },
        (error) => {
          console.log(error);
          setInfo({ checked: true });
        }
      );
    return (
      <Paper className={classes.paper}>
        <Spinner />
      </Paper>
    );
  }

  console.log(deleted);

  let inputLabelProps = {
    classes: {
      root: classes.cssLabel,
      focused: classes.cssFocused,
    },
  };

  let inputProps = {
    classes: {
      root: classes.cssOutlinedInput,
      focused: classes.cssFocused,
      notchedOutline: classes.notchedOutline,
    },
    inputMode: "numeric",
  };

  return (
    <Paper className={classes.paper} style={{marginTop: "3%", marginBottom: "3%"}}>
      <Typography variant="h5" gutterBottom>
        Enter Your Information Below:
      </Typography>
      <Grid container spacing={3} className={classes.formGrid}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            variant="outlined"
            id="name"
            name="name"
            label="Name of Establishment"
            value={info.name || ""}
            fullWidth
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            variant="outlined"
            id="contact"
            name="contact"
            label="Contact Email"
            fullWidth
            autoComplete="email"
            value={info.contact || ""}
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            variant="outlined"
            id="address"
            name="address"
            label="Address line 1"
            fullWidth
            autoComplete="billing address-line1"
            value={info.address || ""}
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
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
            value={info.city || ""}
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
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
            value={info.state || ""}
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
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
            value={info.zip || ""}
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            id="website"
            name="website"
            label="Website"
            fullWidth
            value={info.website || ""}
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            id="yelp"
            name="yelp"
            label="Yelp Link"
            fullWidth
            value={info.yelp || ""}
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            variant="outlined"
            multiline
            id="description"
            name="description"
            label="Description (shown on search page and purchase page)"
            value={info.description || ""}
            onChange={updateInfo}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
            fullWidth
          />
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6">
              Team Photos (shown on purchase page, select multiple):
            </Typography>
          </Grid>
          <input
            style={{ display: "none" }}
            id="upload"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setPhotos({
                ...photos,
                ...Object.fromEntries(
                  Array.from(e.target.files).map((f) => [f.name, f])
                ),
              })
            }
          ></input>
          <Grid item xs={2}>
            <label htmlFor="upload">
              <Button variant="contained" component="span">
                Upload
              </Button>
            </label>
          </Grid>
        </Grid>
        {Object.keys(photos).length > 0 && (
          <Grid item xs={12}>
            <GridList cols={wide ? 5 : 3}>
              {Object.entries(photos).map(([_, file]) => (
                <GridListTile>
                  <img
                    src={file.old ? file.name : URL.createObjectURL(file)}
                    alt="upload"
                  />
                  {
                    <GridListTileBar
                      titlePosition="top"
                      actionPosition="left"
                      actionIcon={
                        <IconButton
                          onClick={() => {
                            let p = photos;
                            delete p[file.name];
                            setPhotos({ ...p });
                            if (file.old) setDeleted([...deleted, file.name]);
                          }}
                        >
                          <DeleteRounded style={{ color: "white" }} />
                        </IconButton>
                      }
                      className={classes.titleBar}
                    />
                  }
                </GridListTile>
              ))}
            </GridList>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          className={classes.submitButton}
          container
          alignItems="center"
        >
          <Button
            type="submit"
            onClick={() => {
              window
                .fetch(restSetInfo(), {
                  mode: "cors",
                  credentials: "include",
                  method: "POST",
                  body: JSON.stringify(info),
                })
                .then((result) => {
                  if (result.ok) {
                    setSubmitMessage("Submitted Info Successfully.");
                  } else {
                    setSubmitMessage("Error, please try again later.");
                  }
                });
              const formData = new FormData();
              Object.entries(photos).forEach(([_, file]) => {
                if (!file.old) formData.append("new[]", file);
              });
              for (const url of deleted) {
                formData.append("deleted[]", url);
              }
              (Object.keys(photos).length > 0 || deleted.length > 0) &&
                window
                  .fetch(restAddPhotos(), {
                    mode: "cors",
                    credentials: "include",
                    method: "POST",
                    body: formData,
                  })
                  .then((result) => {
                    if (result.ok) {
                      setPhotoSubmitMessage("Submitted Photos Successfully.");
                    } else {
                      setPhotoSubmitMessage("Error, could not upload photos.");
                    }
                  });
            }}
            variant="contained"
            size="large"
          >
            Submit
          </Button>
          <Grid item xs="auto">
            <Typography style={{ marginLeft: "20px", fontSize: "1.2rem" }}>
              {submitMessage}
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Typography style={{ marginLeft: "20px", fontSize: "1.2rem" }}>
              {photoSubmitMessage}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function Employees(props) {
  const { classes, info, setInfo } = props;
  const [submitMessage, setSubmitMessage] = React.useState();

  function updateInfo(event, idx, prop) {
    const employees = info.employees;
    employees[idx][prop] = event.target.value;
    setInfo({
      ...info,
      employees: employees,
    });
  }

  function addEmployee() {
    const employees = info.employees || [];
    setInfo({
      ...info,
      employees: [...employees, {}],
    });
  }

  if (info && Object.keys(info).length === 0) {
    let ok;
    window
      .fetch(restGetInfo(), {
        mode: "cors",
        method: "GET",
        cache: "no-cache",
        credentials: "include",
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
        (info) => {
          setInfo(info);
        },
        (error) => {
          console.log(error);
          setInfo({ checked: true });
        }
      );
    return (
      <Paper className={classes.paper}>
        <Spinner />
      </Paper>
    );
  }

  let inputLabelProps = {
    classes: {
      root: classes.cssLabel,
      focused: classes.cssFocused,
    },
  };

  let inputProps = {
    classes: {
      root: classes.cssOutlinedInput,
      focused: classes.cssFocused,
      notchedOutline: classes.notchedOutline,
    },
    inputMode: "numeric",
  };

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Typography variant="h5" gutterBottom>
          Enter Employee Information Below:
        </Typography>
        <Grid item xs />
        <Button
          style={{ backgroundColor: Colors.White }}
          variant="outlined"
          size="large"
          onClick={addEmployee}
        >
          Add Employee
        </Button>
      </Grid>
      <Grid container spacing={3} className={classes.formGrid}>
        {info.employees &&
          info.employees.map(({ name, email }, idx) => (
            <React.Fragment>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  variant="outlined"
                  id={"name" + idx + 1}
                  name={"name" + idx + 1}
                  label={"Employee " + (idx + 1) + " Name"}
                  fullWidth
                  autoComplete="name"
                  value={name || ""}
                  onChange={(e) => updateInfo(e, idx, "name")}
                  InputLabelProps={inputLabelProps}
                  InputProps={inputProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  variant="outlined"
                  id={"contact" + idx + 1}
                  name={"contact" + idx + 1}
                  label={"Employee " + (idx + 1) + " Email"}
                  fullWidth
                  autoComplete="email"
                  value={email || ""}
                  onChange={(e) => updateInfo(e, idx, "email")}
                  InputLabelProps={inputLabelProps}
                  InputProps={inputProps}
                />
              </Grid>
            </React.Fragment>
          ))}
      </Grid>
      <Grid
        className={classes.submitButton}
        container
        direction="row"
        alignItems="center"
      >
        <Button
          type="submit"
          onClick={() => {
            let inf = info;
            delete inf.checked;
            window
              .fetch(restSetInfo(), {
                mode: "cors",
                credentials: "include",
                method: "POST",
                body: JSON.stringify(inf),
              })
              .then((result) => {
                if (result.ok) {
                  setSubmitMessage("Submitted Successfully.");
                } else {
                  setSubmitMessage("Error, please try again later.");
                }
              });
          }}
          variant="contained"
          size="large"
        >
          Submit
        </Button>
        <Grid item>
          <Typography style={{ marginLeft: "20px", fontSize: "1.2rem" }}>
            {submitMessage}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

function Password(props) {
  const { classes } = props;
  const [submitMessage, setSubmitMessage] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const validatePassword = (e) => {
    setConfirmPassword(e.target.value);
    e.target.value === password
      ? setError("")
      : setError("Passwords do not match.");
  };

  let inputLabelProps = {
    classes: {
      root: classes.cssLabel,
      focused: classes.cssFocused,
    },
  };

  let inputProps = {
    classes: {
      root: classes.cssOutlinedInput,
      focused: classes.cssFocused,
      notchedOutline: classes.notchedOutline,
    },
    inputMode: "numeric",
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" gutterBottom>
        Set Security Code:
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please create and enter a security code for your employees to enter when
        redeeming user gift cards. Share this code only with your employees.
        Your code is hashed and stored securely on our servers.
      </Typography>
      <Grid container spacing={3} className={classes.formGrid}>
        <Grid item xs={12}>
          <TextField
            required
            variant="outlined"
            id={"password"}
            name={"password"}
            label={"Password"}
            fullWidth
            inputProps={{ type: "password" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            variant="outlined"
            id={"confirmPassword"}
            name={"confirmPassword"}
            label={"Confirm Password"}
            fullWidth
            inputProps={{ type: "password" }}
            error={!!error}
            helperText={error}
            value={confirmPassword}
            onChange={validatePassword}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
          />
        </Grid>
      </Grid>
      <Grid
        className={classes.submitButton}
        container
        direction="row"
        alignItems="center"
      >
        <Button
          type="submit"
          onClick={() => {
            window
              .fetch(restSetPassword(), {
                mode: "cors",
                credentials: "include",
                method: "POST",
                body: JSON.stringify({ password: password }),
              })
              .then((result) => {
                if (result.ok) {
                  setSubmitMessage("Submitted Successfully.");
                } else {
                  setSubmitMessage("Error, please try again later.");
                }
              });
          }}
          variant="contained"
          size="large"
        >
          Submit
        </Button>
        <Grid item>
          <Typography style={{ marginLeft: "20px", fontSize: "1.2rem" }}>
            {submitMessage}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: {
        addInfo: {
          name: <Typography>Add Your Information</Typography>,
          value: (
            <ListItemIcon>
              <Spinner />
            </ListItemIcon>
          ),
        },
        regSquare: {
          name: <Typography>Add Square Integration</Typography>,
          value: (
            <ListItemIcon>
              <Spinner />
            </ListItemIcon>
          ),
        },
        regEmployees: {
          name: <Typography>Register Employees</Typography>,
          value: (
            <ListItemIcon>
              <Spinner />
            </ListItemIcon>
          ),
        },
        setCode: {
          name: <Typography>Set Security Code</Typography>,
          value: (
            <ListItemIcon>
              <Spinner />
            </ListItemIcon>
          ),
        },
        verify: {
          name: <Typography>Verify Your Phone</Typography>,
          value: (
            <ListItemIcon>
              <Spinner />
            </ListItemIcon>
          ),
        },
        contract: {
          name: <Typography>Agree to Terms of Service</Typography>,
          value: (
            <ListItemIcon>
              <Spinner />
            </ListItemIcon>
          ),
        },
        publish: {
          name: <Typography>Publish Your Restaurant</Typography>,
          value: (
            <ListItemIcon>
              <Spinner />
            </ListItemIcon>
          ),
        },
      },
      verify: false,
      code: "",
      verifyResultMessage: "",
      phone: "",
      publish: false,
      publishResultMessage: "",
      contract: false,
      contractResultMessage: "",
    };
  }

  async makeCall() {
    try {
      const res = await this.checkBackend(restVerifyCall());
      this.setState({ verify: true, phone: res.phone });
    } catch (error) {
      console.log(error);
      if (error.message === "sorry bro, no phone number on google maps") {
        this.displayError(
          "verify",
          "Please add your phone number on Google Maps"
        );
        return;
      }
      this.displayError("verify", "Sorry, there was an error.");
    }
  }

  checkBackend(url, method = "GET", body = null) {
    let ok;
    return window
      .fetch(url, {
        method: method,
        body: body && JSON.stringify(body),
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
      });
  }

  displayResult(key, data, component = "link", buttonProps = {}, icon = true) {
    let item = this.state.list[key];
    const componentMap = {
      a: "a",
      link: Link,
      button: "button",
    };
    const linkMap = {
      a: "href",
      link: "to",
      button: "onClick",
    };
    item.value = data.link && (
      <ListItemSecondaryAction>
        <Button
          {...buttonProps}
          component={componentMap[component]}
          {...{ [linkMap[component]]: data.link }}
          style={{ textTransform: "none", color: Colors.White }}
          endIcon={
            icon ? (
              <AddRounded
                style={{
                  marginRight: "10px",
                  marginLeft: "none",
                  color: "orange",
                  fontSize: 40,
                }}
              />
            ) : null
          }
        >
          <Hidden smDown>
            <Typography className={icon ? this.props.classes.resultText : null}>
              {data.text}
            </Typography>
          </Hidden>
        </Button>
      </ListItemSecondaryAction>
    );
    this.setState({
      list: {
        ...this.state.list,
        [key]: item,
      },
    });
  }

  displayError(key, msg) {
    let item = this.state.list[key];
    item.value = (
      <React.Fragment>
        <Typography className={this.props.classes.resultText}>{msg}</Typography>
        <ListItemIcon>
          <CloseRounded style={{ color: "red", fontSize: 40 }} />
        </ListItemIcon>
      </React.Fragment>
    );
    this.setState({
      list: {
        ...this.state.list,
        [key]: item,
      },
    });
  }

  displayDone(key, msg = "") {
    let item = this.state.list[key];
    item.value = (
      <React.Fragment>
        <Hidden smDown>
          <Typography className={this.props.classes.resultText}>
            {msg}
          </Typography>
        </Hidden>
        <ListItemIcon>
          <CheckRounded style={{ color: "green", fontSize: 40 }} />
        </ListItemIcon>
      </React.Fragment>
    );
    this.setState({
      list: {
        ...this.state.list,
        [key]: item,
      },
    });
  }

  async verify() {
    let error;
    const res = this.checkBackend(restVerifyCode(), "POST", {
      code: this.state.code,
    }).catch((err) => {
      error = err;
      console.log(err);
    });
    if (res) {
      this.setState({ verifyResultMessage: "Successfully Verified" });
      this.props.setInfo({ ...this.props.info, verified: true });
    } else {
      this.setState({ verifyResultMessage: "Error: " + error });
    }
  }

  async publish() {
    let error;
    const res = await this.checkBackend(restPublish()).catch((err) => {
      error = err;
      console.log(err);
    });
    if (res) {
      this.setState({ publishResultMessage: "Published Successfully" });
      this.props.setInfo({ ...this.props.info, published: true });
    } else {
      this.setState({ publishResultMessage: "Error: " + error.message });
    }
  }

  async contract() {
    let error;
    const res = await this.checkBackend(restContract()).catch((err) => {
      error = err;
      console.log(err);
    });
    if (res) {
      this.setState({ contractResultMessage: "Submitted Successfully" });
      this.props.setInfo({ ...this.props.info, signed: true });
    } else {
      this.setState({ contractResultMessage: "Error: " + error.message });
    }
  }

  checkItems(key) {
    const itemsDict = {
      regEmployees: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            (info) => {
              this.props.setInfo(info);
              if (info.employees) {
                this.displayDone(
                  "regEmployees",
                  <React.Fragment>
                    <Button
                      style={{ marginLeft: "15px", color: Colors.White }}
                      variant="outlined"
                      size="small"
                      component={Link}
                      to="/restaurants/employees"
                    >
                      Add More
                    </Button>
                  </React.Fragment>
                );
              } else {
                this.displayResult(
                  "regEmployees",
                  { text: "Get Started", link: "/restaurants/employees" },
                  "link"
                );
              }
            },
            (error) => {
              if (
                error.message === "sorry bro, that restaurant doesn't exist"
              ) {
                this.displayResult(
                  "regEmployees",
                  { text: "Get Started", link: "/restaurants/employees" },
                  "link"
                );
                this.props.setInfo({ checked: true });
              } else {
                console.log(error);
                this.props.setInfo({ checked: true });
                this.displayError("regEmployees", "Please log in again.");
              }
            }
          );
        } else {
          if (this.props.info.employees) {
            this.displayDone(
              "regEmployees",
              <React.Fragment>
                <Button
                  style={{ marginLeft: "15px", color: Colors.White }}
                  variant="outlined"
                  size="small"
                  component={Link}
                  to="/restaurants/employees"
                >
                  Add More
                </Button>
              </React.Fragment>
            );
          } else {
            this.displayResult(
              "regEmployees",
              { text: "Get Started", link: "/restaurants/employees" },
              "link"
            );
          }
        }
      },
      setCode: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            (info) => {
              this.props.setInfo(info);
              if (info.hasPassword) {
                this.displayDone(
                  "setCode",
                  <React.Fragment>
                    <Button
                      style={{ marginLeft: "15px" }}
                      variant="outlined"
                      size="small"
                      component={Link}
                      to="/restaurants/setpassword"
                    >
                      Change
                    </Button>
                  </React.Fragment>
                );
              } else {
                this.displayResult(
                  "setCode",
                  { text: "Get Started", link: "/restaurants/setpassword" },
                  "link"
                );
              }
            },
            (error) => {
              if (
                error.message === "sorry bro, that restaurant doesn't exist"
              ) {
                this.displayResult(
                  "setCode",
                  { text: "Get Started", link: "/restaurants/setpassword" },
                  "link"
                );
                this.props.setInfo({ checked: true });
              } else {
                console.log(error);
                this.props.setInfo({ checked: true });
                this.displayError("setCode", "Please log in again.");
              }
            }
          );
        } else {
          if (this.props.info.hasPassword) {
            this.displayDone(
              "setCode",
              <React.Fragment>
                <Button
                  style={{ marginLeft: "15px", color: Colors.White }}
                  variant="outlined"
                  size="small"
                  component={Link}
                  to="/restaurants/setpassword"
                >
                  Change
                </Button>
              </React.Fragment>
            );
          } else {
            this.displayResult(
              "setCode",
              { text: "Get Started", link: "/restaurants/setpassword" },
              "link"
            );
          }
        }
      },
      regSquare: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            (info) => {
              this.props.setInfo(info);
              if (info.hasSquare) {
                this.displayDone("regSquare");
              } else {
                this.displayResult(
                  "regSquare",
                  { text: "Get Started", link: squareSignup() },
                  "a"
                );
              }
            },
            (error) => {
              if (
                error.message === "sorry bro, that restaurant doesn't exist"
              ) {
                this.displayError("regSquare", "Please A info first");
              } else {
                console.log(error);
                this.displayError("regSquare", "Please log in again.");
              }
            }
          );
        } else {
          if (this.props.info.name) {
            if (this.props.info.hasSquare) {
              this.displayDone("regSquare");
            } else {
              this.displayResult(
                "regSquare",
                { text: "Get Started", link: squareSignup() },
                "a"
              );
            }
          } else {
            this.displayError("regSquare", "Please add info first");
          }
        }
      },
      verify: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            (info) => {
              this.props.setInfo(info);
              if (info.verified) {
                this.displayDone("verify");
              } else {
                this.displayResult(
                  "verify",
                  { text: "Call Me Now", link: () => this.makeCall() },
                  "button"
                );
              }
            },
            (error) => {
              if (
                error.message === "sorry bro, that restaurant doesn't exist"
              ) {
                this.displayError("verify", "Please add info first");
              } else {
                console.log(error);
                this.displayError("verify", "Please log in again.");
              }
            }
          );
        } else {
          if (this.props.info.name) {
            if (this.props.info.verified) {
              this.displayDone("verify");
            } else {
              this.displayResult(
                "verify",
                { text: "Call Me Now", link: () => this.makeCall() },
                "button"
              );
            }
          } else {
            this.displayError("verify", "Please add info first");
          }
        }
      },
      publish: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            (info) => {
              this.props.setInfo(info);
              if (info.published) {
                this.displayDone("publish");
              } else {
                this.displayResult(
                  "publish",
                  {
                    text: "Publish",
                    link: () => this.setState({ publish: true }),
                  },
                  "button",
                  { color: "secondary", variant: "outlined", size: "small" },
                  false
                );
              }
            },
            (error) => {
              if (
                error.message === "sorry bro, that restaurant doesn't exist"
              ) {
                this.displayError("publish", "Please add info first");
              } else {
                console.log(error);
                this.displayError("publish", "Please log in again.");
              }
            }
          );
        } else {
          if (this.props.info.name) {
            if (this.props.info.published) {
              this.displayDone("publish");
            } else {
              this.displayResult(
                "publish",
                {
                  text: "Publish",
                  link: () => this.setState({ publish: true }),
                },
                "button",
                { color: "secondary", variant: "outlined", size: "small" },
                false
              );
            }
          } else {
            this.displayError("publish", "Please add info first");
          }
        }
      },
      contract: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            (info) => {
              this.props.setInfo(info);
              if (info.signed) {
                this.displayDone("contract");
              } else {
                this.displayResult(
                  "contract",
                  {
                    text: "View",
                    link: () => this.setState({ contract: true }),
                  },
                  "button"
                );
              }
            },
            (error) => {
              if (
                error.message === "sorry bro, that restaurant doesn't exist"
              ) {
                this.displayError("contract", "Please add info first");
              } else {
                console.log(error);
                this.displayError("contract", "Please log in again.");
              }
            }
          );
        } else {
          if (this.props.info.name) {
            if (this.props.info.signed) {
              this.displayDone("contract");
            } else {
              this.displayResult(
                "contract",
                { text: "View", link: () => this.setState({ contract: true }) },
                "button"
              );
            }
          } else {
            this.displayError("contract", "Please add info first");
          }
        }
      },
      addInfo: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            (info) => {
              this.props.setInfo(info);
              this.displayDone(
                "addInfo",
                <React.Fragment>
                  <Button
                    style={{
                      marginLeft: "15px",
                      color: Colors.White,
                    }}
                    variant="outlined"
                    size="small"
                    component={Link}
                    to="/restaurants/info"
                  >
                    Update Info
                  </Button>
                </React.Fragment>
              );
            },
            (error) => {
              if (
                error.message === "sorry bro, that restaurant doesn't exist"
              ) {
                this.props.setInfo({ checked: true });
                this.displayResult(
                  "addInfo",
                  { text: "Get Started", link: "/restaurants/info" },
                  "link"
                );
              } else {
                console.log(error);
                this.props.setInfo({ checked: true });
                this.displayError("addInfo", "Please log in again.");
              }
            }
          );
        } else {
          if (this.props.info.name) {
            this.displayDone(
              "addInfo",
              <React.Fragment>
                <Button
                  style={{ marginLeft: "15px", color: Colors.White }}
                  variant="outlined"
                  size="small"
                  component={Link}
                  to="/restaurants/info"
                >
                  Update Info
                </Button>
              </React.Fragment>
            );
          } else {
            this.displayResult(
              "addInfo",
              { text: "Get Started", link: "/restaurants/info" },
              "link"
            );
          }
        }
      },
    };
    itemsDict[key]();
  }

  componentDidMount() {
    for (let key in this.state.list) {
      this.checkItems(key);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.info !== prevProps.info) {
      for (let key in this.state.list) {
        this.checkItems(key);
      }
    }
  }

  render() {
    const classes = this.props.classes;
    const fullScreen = this.props.width < 600;

    return (
      <Paper className={classes.paper}>
        <Typography align="center" variant="h4">
          Restaurant Dashboard
        </Typography>
        <List component="nav">
          {Object.entries(this.state.list).map(([key, { name, value }]) => (
            <ListItem divider key={key}>
              <ListItemText
                primary={name}
                className={classes.homepageListText}
              />
              {value}
            </ListItem>
          ))}
        </List>
        <Dialog
          maxWidth="xs"
          fullWidth
          open={this.state.verify}
          onClose={() => this.setState({ verify: false })}
        >
          <DialogTitle style={{ margin: "auto" }}>
            You Will Receive a Code Shortly
            <br />
            Phone: {this.state.phone}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ marginBottom: "16px" }}>
              <Grid item xs={10} sm={8}>
                <TextField
                  InputProps={{ className: classes.searchInput }}
                  variant="outlined"
                  label="Code"
                  value={this.state.code}
                  onChange={(e) => this.setState({ code: e.target.value })}
                  className={classes.searchBar}
                />
              </Grid>
              <Grid item container alignItems="flex-end" xs={6} sm={4}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => this.verify()}
                >
                  Confirm
                </Button>
              </Grid>
              {this.state.verifyResultMessage && (
                <Typography>{this.state.verifyResultMessage}</Typography>
              )}
            </Grid>
            {this.state.resultMessage && (
              <Typography>{this.state.resultMessage}</Typography>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          maxWidth="xs"
          fullWidth
          open={this.state.publish}
          onClose={() => this.setState({ publish: false })}
        >
          <DialogTitle style={{ margin: "auto" }}>Confirm Publish</DialogTitle>
          <DialogContent>
            <Button
              variant="contained"
              color="secondary"
              style={{ margin: "auto", marginBottom: "10px", display: "block" }}
              onClick={() => this.publish()}
            >
              Confirm
            </Button>
            {this.state.publishResultMessage && (
              <Typography align="center">
                {this.state.publishResultMessage}
              </Typography>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          maxWidth="md"
          fullWidth
          fullscreen={fullScreen ? true : undefined}
          open={this.state.contract}
          onClose={() => this.setState({ contract: false })}
        >
          <DialogTitle style={{ margin: "auto" }}>
            Read These Terms and Sign Below
          </DialogTitle>
          <DialogContent>
            {(() => {
              this.state.contract &&
                window
                  .fetch(process.env.PUBLIC_URL + "/contract.txt")
                  .then((result) => result.text())
                  .then(s => s.replace(/\[INSERT RESTAURANT\]/g, this.props.info.name)
                    .replace(/\[INSERT ADDRESS\]/g, this.props.info.address)
                    .replace(/\[INSERT DATE\]/g, (new Date()).toDateString()))
                  .then(
                    h => (document.getElementById("contract").innerHTML = h)
                  );
              return (
                <Typography
                  id="contract"
                  variant="body1"
                  gutterBottom
                  style={{ fontSize: "1.1rem" }}
                ></Typography>
              );
            })()}
            <DialogActions>
              <TextField
                required
                margin="dense"
                id="name"
                label="Signature"
                fullWidth
                style={{ marginRight: "30px" }}
              />
              <Button
                onClick={() => this.setState({ contract: false })}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={() => this.contract()}
              >
                Sign
              </Button>
            </DialogActions>
            {this.state.contractResultMessage && (
              <Typography align="center">
                {this.state.contractResultMessage}
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    );
  }
}

Homepage = withWidth()(Homepage);

function Content(props) {
  const { classes, tabValue, info, setInfo } = props;

  return (
    <React.Fragment>
      <TabPanel index="dashboard" tabValue={tabValue}>
        <Homepage classes={classes} setInfo={setInfo} info={info} />
      </TabPanel>
      <TabPanel index="info" tabValue={tabValue}>
        <AddInfo classes={classes} setInfo={setInfo} info={info} />
      </TabPanel>
      <TabPanel index="employees" tabValue={tabValue}>
        <Employees classes={classes} setInfo={setInfo} info={info} />
      </TabPanel>
      <TabPanel index="password" tabValue={tabValue}>
        <Password classes={classes} />
      </TabPanel>
      <TabPanel index="data" tabValue={tabValue}>
        <Data classes={classes} />
      </TabPanel>
    </React.Fragment>
  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  tabValue: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  setInfo: PropTypes.func.isRequired,
};

export default withStyles(styles)(Content);
