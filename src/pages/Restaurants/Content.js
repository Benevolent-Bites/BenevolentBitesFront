import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Spinner } from '../common';
import { Link } from 'react-router-dom';
import { restGetInfo, restSetInfo, squareSignup, restSetPassword, restVerifyCall, restVerifyCode } from '../../endpoints';
import {
  Typography,
  Paper,
  Grid,
  Hidden,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListItem,
} from '@material-ui/core'

import {
  CheckRounded,
  CloseRounded,
  AddRounded
} from '@material-ui/icons'

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
  }
});

function TabPanel(props) {
  const { children, tabValue, index } = props;
  return (
    index === tabValue && children
  )
}

function AddInfo (props) {
  const { classes, info, setInfo } = props;
  const [submitMessage, setSubmitMessage] = React.useState();

  function updateInfo (event) {
    setInfo({
      ...info,
      [event.target.name]: event.target.value
    })
  }

  if (info && Object.keys(info).length === 0) {
    let ok;
    window.fetch(
      restGetInfo(),
      {mode: 'cors', method: 'GET', cache: 'no-cache', credentials: 'include'}
    ).then(result => {
      ok = result.ok;
      return result.json()
    }).then(response => {
      if(!ok) {throw new Error(response.error)}
      return response
    }).then(
      info => {setInfo(info)},
      error => {console.log(error); setInfo({checked: true})}
    )
    return(<Paper className={classes.paper}><Spinner/></Paper>)
  }

  return(<Paper className={classes.paper}>
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
          value={info.name || ''}
          fullWidth
          onChange={updateInfo}
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
          value={info.contact || ''}
          onChange={updateInfo}
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
          value={info.address || ''}
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
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          id="website"
          name="website"
          label="Website"
          fullWidth
          value={info.website || ''}
          onChange={updateInfo}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          id="yelp"
          name="yelp"
          label="Yelp Link"
          fullWidth
          value={info.yelp || ''}
          onChange={updateInfo}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          variant="outlined"
          multiline
          id="description"
          name="description"
          label="Description"
          value={info.description || ''}
          onChange={updateInfo}
          fullWidth
        />
      </Grid>
    </Grid>
    <Grid className={classes.submitButton} container direction="row" alignItems="center">
      <Button
        type="submit" onClick={() => {
          window.fetch(
            restSetInfo(),
            {
              mode: 'cors',
              credentials: 'include',
              method: 'POST',
              body: JSON.stringify(info)
            }
          ).then((result) => {
            if (result.ok) {
              setSubmitMessage("Submitted Successfully.");
            } else {
              setSubmitMessage("Error, please try again later.")
            }
           });
        }}
        variant="contained"
        color="primary"
        size="large">Submit</Button>
      <Grid item><Typography style={{marginLeft: '20px', fontSize: '1.2rem'}}>{submitMessage}</Typography></Grid>
    </Grid>
  </Paper>
  )
}

function Employees (props) {
  const { classes, info, setInfo } = props;
  const [submitMessage, setSubmitMessage] = React.useState();

  function updateInfo (event, idx, prop) {
    const employees = info.employees;
    employees[idx][prop] = event.target.value;
    setInfo({
      ...info,
      employees: employees
    })
  }

  function addEmployee () {
    const employees = info.employees || [];
    setInfo({
      ...info,
      employees: [...employees, {}]
    })
  }

  if (info && Object.keys(info).length === 0) {
    let ok;
    window.fetch(
      restGetInfo(),
      {mode: 'cors', method: 'GET', cache: 'no-cache', credentials: 'include'}
    ).then(result => {
      ok = result.ok;
      return result.json()
    }).then(response => {
      if(!ok) {throw new Error(response.error)}
      return response
    }).then(
      info => {setInfo(info)},
      error => {console.log(error);setInfo({checked:true})}
    )
    return(<Paper className={classes.paper}><Spinner/></Paper>)
  }

  return(<Paper className={classes.paper}>
    <Grid container>
      <Typography variant="h5" gutterBottom>
          Enter Employee Information Below:
      </Typography>
      <Grid item xs/>
      <Button color="primary" variant="outlined" size="large" onClick={addEmployee}>
        Add Employee
      </Button>
    </Grid>
    <Grid container spacing={3} className={classes.formGrid}>
      {info.employees && info.employees.map(({name, email}, idx) => <React.Fragment>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            variant="outlined"
            id={"name" + idx + 1}
            name={"name" + idx + 1}
            label={"Employee " + (idx + 1) + " Name"}
            fullWidth
            autoComplete="name"
            value={name || ''}
            onChange={e => updateInfo(e, idx, "name")}
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
            value={email || ''}
            onChange={e => updateInfo(e, idx, "email")}
          />
        </Grid>
      </React.Fragment>)}
    </Grid>
    <Grid className={classes.submitButton} container direction="row" alignItems="center">
      <Button
        type="submit" onClick={() => {
          let inf = info;
          delete inf.checked;
          window.fetch(
            restSetInfo(),
            {
              mode: 'cors',
              credentials: 'include',
              method: 'POST',
              body: JSON.stringify(inf)
            }
          ).then((result) => {
            if (result.ok) {
              setSubmitMessage("Submitted Successfully.");
            } else {
              setSubmitMessage("Error, please try again later.")
            }
           });
        }}
        variant="contained"
        color="primary"
        size="large">Submit</Button>
      <Grid item><Typography style={{marginLeft: '20px', fontSize: '1.2rem'}}>{submitMessage}</Typography></Grid>
    </Grid>
  </Paper>
  )
}

function Password (props) {
  const { classes } = props;
  const [submitMessage, setSubmitMessage] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const validatePassword = e => {
    setConfirmPassword(e.target.value);
    e.target.value === password ? setError("") : setError("Passwords do not match.");
  };

  return(<Paper className={classes.paper}>
    <Typography variant="h5" gutterBottom>
        Set Security Code:
    </Typography>
    <Typography variant="body1" gutterBottom>
        Please create and enter a security code for your employees to enter when redeeming user gift cards.
        Share this code only with your employees.
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
          inputProps={{type:'password'}}
          value={password}
          onChange={e => setPassword(e.target.value)}
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
          inputProps={{type:'password'}}
          error={!!error}
          helperText={error}
          value={confirmPassword}
          onChange={validatePassword}
        />
      </Grid>
    </Grid>
    <Grid className={classes.submitButton} container direction="row" alignItems="center">
      <Button
        type="submit" onClick={() => {
          window.fetch(
            restSetPassword(),
            {
              mode: 'cors',
              credentials: 'include',
              method: 'POST',
              body: JSON.stringify({password: password})
            }
          ).then((result) => {
            if (result.ok) {
              setSubmitMessage("Submitted Successfully.");
            } else {
              setSubmitMessage("Error, please try again later.")
            }
           });
        }}
        variant="contained"
        color="primary"
        size="large">Submit</Button>
      <Grid item><Typography style={{marginLeft: '20px', fontSize: '1.2rem'}}>{submitMessage}</Typography></Grid>
    </Grid>
  </Paper>
  )
}

class Homepage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      list: {
        addInfo: {name: <Typography>Add Your Information</Typography>, value: <ListItemIcon><Spinner/></ListItemIcon>},
        regSquare: {name: <Typography>Add Square Integration</Typography>, value: <ListItemIcon><Spinner/></ListItemIcon>},
        regEmployees: {name: <Typography>Register Employees</Typography>, value: <ListItemIcon><Spinner/></ListItemIcon>},
        verify: {name: <Typography>Verify Your Phone</Typography>, value: <ListItemIcon><Spinner/></ListItemIcon>}
      },
      verify: false,
      code: "",
      resultMessage: ""
    }
  }

  async makeCall () {
    const res = await this.checkBackend(restVerifyCall()).catch(err => console.log(err));
    if (!res) {
      this.displayError("verify", "Sorry, there was an error.")
    } else {
      this.setState({verify: true});
    }
  }

  checkBackend (url, method="GET", body=null) {
    let ok;
    return (
      window.fetch(
        url,
        {
          method: method,
          body: body,
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
      "link": Link,
      "button": "button"
    };
    const linkMap = {
      "a": "href",
      "link": "to",
      "button": "onClick"
    };
    item.value = data.link && <ListItemSecondaryAction>
      <Button component={componentMap[component]} {...{[linkMap[component]]: data.link}} style={{textTransform: 'none'}}
        endIcon={<AddRounded style={{ marginRight: '10px', marginLeft: 'none', color: 'blue', fontSize: 40, textTransform: 'none' }} />}>
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

  async verify() {
    let error;
    const res = this.checkBackend(restVerifyCode(), "POST", {code: this.state.code}).catch(err => {
      error = err; console.log(err)})
    if (res) {
      this.setState({resultMessage: "Successfully Verified"});
      this.props.setInfo({...this.props.info, verified: true})
    } else {
      this.setState({resultMessage: "Error: " + error});
    }
  }

  checkItems(key) {
    const itemsDict = {
      regEmployees: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            info => {
              this.props.setInfo(info);
              if (info.employees) {
                this.displayDone("regEmployees", 
                  <React.Fragment>
                    Done!
                    <Button style={{marginLeft: '15px'}} variant="outlined" size="small" 
                      component={Link} to="/restaurants/employees">Add More</Button>
                  </React.Fragment>);
              } else {
                this.displayResult("regEmployees", {text: "Get Started", link: "/restaurants/employees"}, "link");
              }
            },
            error => {
              if (error.message === "sorry bro, that restaurant doesn't exist") {
                this.displayResult("regEmployees", {text: "Get Started", link: "/restaurants/employees"}, "link");
                this.props.setInfo({checked: true});
              } else {
                console.log(error);
                this.props.setInfo({checked:true});
                this.displayError("regEmployees", "Please log in again.");
              }
            }
          )
        } else {
          if (this.props.info.employees) {
            this.displayDone("regEmployees", 
              <React.Fragment>
                Done!
                <Button style={{marginLeft: '15px'}} variant="outlined" size="small" 
                  component={Link} to="/restaurants/employees">Add More</Button>
              </React.Fragment>);
          } else {
            this.displayResult("regEmployees", {text: "Get Started", link: "/restaurants/employees"}, "link");
          }
        }
      },
      regSquare: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            info => {
              this.props.setInfo(info);
              if (info.hasSquare === true) {
                this.displayDone("regSquare");
              }
              else {
                this.displayResult("regSquare", {text: "Get Started", link: squareSignup()}, "a");
              }
            },
            error => {
              if (error.message === "sorry bro, that restaurant doesn't exist") {
                this.displayError("regSquare", "Please add info first");
              } else {
                console.log(error);
                this.displayError("regSquare", "Please log in again.");
              }
            }
          )
        } else {
          if (this.props.info.name) {
            if (this.props.info.hasSquare === true) {
              this.displayDone("regSquare");
            }
            else {
              this.displayResult("regSquare", {text: "Get Started", link: squareSignup()}, "a");
            }
          } else {
            this.displayError("regSquare", "Please add info first");
          }
        }
      },
      verify: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            info => {
              this.props.setInfo(info);
              if (info.verified === true) {
                this.displayDone("verify");
              }
              else {
                this.displayResult("verify", {text: "Call Me Now", link: () => this.makeCall()}, "button");
              }
            },
            error => {
              if (error.message === "sorry bro, that restaurant doesn't exist") {
                this.displayError("verify", "Please add info first");
              } else {
                console.log(error);
                this.displayError("verify", "Please log in again.");
              }
            }
          )
        } else {
          if (this.props.info.name) {
            if (this.props.info.verified === true) {
              this.displayDone("verify");
            }
            else {
              this.displayResult("verify", {text: "Call Me Now", link: () => this.makeCall()}, "button");
            }
          } else {
            this.displayError("verify", "Please add info first");
          }
        }
      },
      addInfo: () => {
        if (Object.keys(this.props.info).length === 0) {
          this.checkBackend(restGetInfo()).then(
            (info) => {
              this.props.setInfo(info);
              this.displayDone("addInfo", 
                <React.Fragment>
                  Done!
                  <Button style={{marginLeft: '15px'}} variant="outlined" size="small" 
                    component={Link} to="/restaurants/info">Update Info</Button>
                </React.Fragment>
          );
            },
            error => {
              if (error.message === "sorry bro, that restaurant doesn't exist") {
                this.props.setInfo({checked: true});
                this.displayResult("addInfo", {text: "Get Started", link: "/restaurants/info"}, "link");
              } else {
                console.log(error);
                this.props.setInfo({checked: true});
                this.displayError("addInfo", "Please log in again.");
              }
            }
          )
        } else {
          if (this.props.info.name) {
            this.displayDone("addInfo", 
              <React.Fragment>
                Done!
                <Button style={{marginLeft: '15px'}} variant="outlined" size="small" 
                  component={Link} to="/restaurants/info">Update Info</Button>
              </React.Fragment>
            );
          } else {
            this.displayResult("addInfo", {text: "Get Started", link: "/restaurants/info"}, "link");
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
        <Dialog maxWidth='xs' fullWidth open={this.state.verify} onClose={() => this.setState({verify: false})}>
          <DialogTitle style={{margin: 'auto'}}>You Will Receive a Code Shortly</DialogTitle>
          <DialogContent>
              <Grid container spacing={2} style={{marginBottom: '16px'}}>
                  <Grid item xs={10} sm={8}>
                      <TextField InputProps={{className: classes.searchInput}} 
                          variant="outlined" label="Code" value={this.state.code} 
                              onChange={(e) => this.setState({code: e.target.value})} className={classes.searchBar} />
                  </Grid>
                  <Grid item container alignItems="flex-end" xs={6} sm={4}>
                      <Button variant="contained" color="secondary" onClick={() => this.verify()}>Confirm</Button>
                  </Grid>
                  {this.state.resultMessage && <Typography>{this.state.resultMessage}</Typography>}
              </Grid>
          </DialogContent>
      </Dialog>
      </Paper>
    );
  }
}

function Content(props) {
  const { classes, tabValue, info, setInfo } = props;

  return (
  <React.Fragment>
    <TabPanel index="dashboard" tabValue={tabValue}>
      <Homepage classes={classes} setInfo={setInfo} info={info}/>
    </TabPanel>
    <TabPanel index="info" tabValue={tabValue}>
      <AddInfo classes={classes} setInfo={setInfo} info={info}/>
    </TabPanel>
    <TabPanel index="employees" tabValue={tabValue}>
      <Employees classes={classes} setInfo={setInfo} info={info}/>
    </TabPanel>
    <TabPanel index="password" tabValue={tabValue}>
      <Password classes={classes} />
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
