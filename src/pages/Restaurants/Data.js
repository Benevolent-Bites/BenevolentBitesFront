import React from "react";
import { restGetReport } from "../../endpoints";

import {
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";

import HelpRoundedIcon from "@material-ui/icons/HelpRounded";

import {
  VictoryPie,
  VictoryLegend,
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryLabel,
  VictoryAxis,
} from "victory";
import { nullLiteral } from "@babel/types";

// data should be an array of the form
// [{timestamp: "", amount: 0}, ...]
function createWeekData(data) {
  var out = JSON.parse(JSON.stringify(weekData));
  for (let d of data) {
    var day = getDay(d.timestamp);
    out[day].y += Math.abs(d.amount / 100.0);
  }
  return out;
}

function createMonthData(data) {
  var out = JSON.parse(JSON.stringify(monthData));
  for (let d of data) {
    var day = getMonth(d.timestamp);
    out[day].y += Math.abs(d.amount / 100.0);
  }
  return out;
}

function getDay(timestamp) {
  var date = new Date(timestamp);
  return date.getDay();
}

function getMonth(timestamp) {
  var date = new Date(timestamp);
  return date.getMonth();
}

// Data class
export default class Data extends React.Component {
  constructor(props) {
    super(props);

    var exampleAPIData = {
      total: 0,
      employees: 0,
      restaurant: 0,
      redeemed: 0,
      outstanding: 0,
      transactions: [{ timestamp: "2020-04-13T00:27:56+00:00", amount: 0 }],
      sales: [{ timestamp: "2020-04-13T00:27:56+00:00", amount: 0 }],
    };

    this.state = {
      range: "week",
      purchaseData: null,
      redeemData: null,
      apiData: exampleAPIData,
      piData: [
        {
          x: "Restaurant Funds",
          y: exampleAPIData["total"] / 100.0,
        },
        {
          x: "Employee Dues",
          y: exampleAPIData["employees"] / 100.0,
        },
      ],
    };

    // Sample Data
    this.setState({
      purchaseData: this.generatePurchaseData(
        this.state.range,
        this.state.apiData
      ),
      redeemData: this.generateRedeemData(this.state.range, this.state.apiData),
    });
  }

  generatePurchaseData(r, data) {
    var d;
    if (r == "week") {
      d = createWeekData(data.sales);
    }
    if (r == "month") {
      d = createMonthData(data.sales);
    }
    return d;
  }

  generateRedeemData(r, data) {
    var d;
    if (r == "week") {
      d = createWeekData(data.transactions);
    }
    if (r == "month") {
      d = createMonthData(data.transactions);
    }
    return d;
  }

  // Get data from API
  async componentDidMount() {
    var d = await this.updateData("week");
    var piData = this.getPiData(d);
    this.setState({
      purchaseData: this.generatePurchaseData(this.state.range, d),
      redeemData: this.generateRedeemData(this.state.range, d),
      piData: piData,
      apiData: d,
    });
  }

  async updateData(range) {
    const data = await this.checkBackend(
      restGetReport() + "?range=" + range
    ).catch((error) => console.log(error));
    data && this.setState({ apiData: data });
    console.log("API Response: ", data);
    return data;
  }

  getPiData(d) {
    return [
      {
        x: "Restaurant Funds",
        y: d["restaurant"] / 100.0,
      },
      {
        x: "Employee Dues",
        y: d["employees"] / 100.0,
      },
    ];
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

  // User selected another time range
  async handleChange(event) {
    var d = await this.updateData(event.target.value);
    var piData = this.getPiData(d);
    this.setState({
      range: event.target.value,
      purchaseData: this.generatePurchaseData(event.target.value, d),
      redeemData: this.generateRedeemData(event.target.value, d),
      piData: piData,
      apiData: d,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Box style={{ margin: "5%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper} style={{ maxWidth: 2500 }}>
              <Grid container spacing={3}>
                <Grid item xs={1}>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                    style={{ marginBottom: 25 }}
                  >
                    Options:
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Time
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.range}
                      onChange={(event) => {
                        this.handleChange(event);
                      }}
                      label="Time"
                      autoWidth
                    >
                      <MenuItem value="week">Week</MenuItem>
                      <MenuItem value="month">Month</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper} style={{ maxWidth: 2500 }}>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Total Credit Sold
                        <Tooltip title={helpLabels.get("n_total")}>
                          <IconButton aria-label="help">
                            <HelpRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Typography variant="h4" component="h4">
                        ${this.state.piData[1].y + this.state.piData[0].y}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Restaurant Funds
                        <Tooltip title={helpLabels.get("n_rest")}>
                          <IconButton aria-label="help">
                            <HelpRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Typography variant="h4" component="h4">
                        ${this.state.piData[0].y}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Employee Dues
                        <Tooltip title={helpLabels.get("n_emp")}>
                          <IconButton aria-label="help">
                            <HelpRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Typography variant="h4" component="h4">
                        ${this.state.piData[1].y}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper} style={{ maxWidth: 2500 }}>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Card>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Fund Split
                        <Tooltip title={helpLabels.get("n_split")}>
                          <IconButton aria-label="help">
                            <HelpRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Grid container>
                        <Grid item xs={12}>
                          <VictoryPie
                            data={this.state.piData}
                            colorScale="qualitative"
                            labels={() => null}
                          />
                        </Grid>
                        <Grid item xs={12} alignItems="center">
                          <VictoryLegend
                            orientation="vertical"
                            centerTitle={true}
                            height={150}
                            style={{ border: { stroke: "none" } }}
                            colorScale="qualitative"
                            style={{ labels: { fontSize: 24 } }}
                            data={[
                              { name: "Restaurant Funds" },
                              { name: "Employee Dues" },
                            ]}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={9}>
                  <Card>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Credit Purchases
                        <Tooltip title={helpLabels.get("g_credit")}>
                          <IconButton aria-label="help">
                            <HelpRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <VictoryChart
                        theme={VictoryTheme.material}
                        height={120}
                        padding={{ left: 40, top: 10, bottom: 25 }}
                      >
                        <VictoryAxis style={{ tickLabels: { fontSize: 8 } }} />
                        <VictoryAxis
                          dependentAxis
                          style={{ tickLabels: { fontSize: 8 } }}
                        />
                        <VictoryLine
                          data={this.state.purchaseData}
                          scale={{ x: "linear", y: "linear" }}
                        />
                      </VictoryChart>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper} style={{ maxWidth: 2500 }}>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Card style={{ marginBottom: 50 }}>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Redeemed Credit
                        <Tooltip title={helpLabels.get("n_redeem")}>
                          <IconButton aria-label="help">
                            <HelpRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Typography variant="h4" component="h4">
                        ${Math.abs(this.state.apiData.redeemed / 100.0)}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Outstanding Credit
                        <Tooltip title={helpLabels.get("n_outstanding")}>
                          <IconButton aria-label="help">
                            <HelpRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Typography variant="h4" component="h4">
                        ${Math.abs(this.state.apiData.outstanding / 100.0)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={9}>
                  <Card>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Credit Redemptions
                        <Tooltip title={helpLabels.get("g_redeem")}>
                          <IconButton aria-label="help">
                            <HelpRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <VictoryChart
                        theme={VictoryTheme.material}
                        scale={{ x: "linear" }}
                        height={120}
                        padding={{ left: 40, top: 10, bottom: 25 }}
                      >
                        <VictoryAxis style={{ tickLabels: { fontSize: 8 } }} />
                        <VictoryAxis
                          dependentAxis
                          style={{ tickLabels: { fontSize: 8 } }}
                        />
                        <VictoryLine
                          data={this.state.redeemData}
                          scale={{ x: "linear", y: "linear" }}
                          labelComponent={<VictoryLabel />}
                        />
                      </VictoryChart>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

var weekData = [
  {
    x: "SU",
    y: 0,
  },
  {
    x: "MO",
    y: 0,
  },
  {
    x: "TU",
    y: 0,
  },
  {
    x: "WE",
    y: 0,
  },
  {
    x: "TH",
    y: 0,
  },
  {
    x: "FR",
    y: 0,
  },
  {
    x: "SA",
    y: 0,
  },
];

var monthData = [
  {
    x: "Jan",
    y: 0,
  },
  {
    x: "Feb",
    y: 0,
  },
  {
    x: "Mar",
    y: 0,
  },
  {
    x: "Apr",
    y: 0,
  },
  {
    x: "May",
    y: 0,
  },
  {
    x: "Jun",
    y: 0,
  },
  {
    x: "Jul",
    y: 0,
  },
  {
    x: "Aug",
    y: 0,
  },
  {
    x: "Sep",
    y: 0,
  },
  {
    x: "Oct",
    y: 0,
  },
  {
    x: "Nov",
    y: 0,
  },
  {
    x: "Dec",
    y: 0,
  },
];

var helpLabels = new Map();
helpLabels.set(
  "n_total",
  "Total amount of credit purchased for your restaurant, in the selected time period"
);
helpLabels.set(
  "n_rest",
  "Amount of credit income to be kept by the restaurant, in the selected time period"
);
helpLabels.set(
  "n_emp",
  "Amount of credit income to be distributed among employees, in the selected time period"
);
helpLabels.set(
  "n_split",
  "Proportion of funds that go to 1) Restaurant and 2) Employees"
);
helpLabels.set(
  "g_credit",
  "Graph of credit purchases on the Benevolent Bites platform, in the selected time period"
);
helpLabels.set(
  "n_redeem",
  "Amount of credit that was redeemed at your restaurant, in the selected time period"
);
helpLabels.set(
  "g_redeem",
  "Graph of credit being redeemed at your restaurant, in the selected time period"
);
helpLabels.set(
  "n_outstanding",
  "Total amount of sold credit which has yet to be redeemed at your restaurant"
);
