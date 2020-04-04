import React from 'react';
import PropTypes from 'prop-types';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Hidden,
  Typography
} from '@material-ui/core'
import { Switch, Route } from 'react-router-dom';
import Navigator from './Navigator';
import Restaurants from './Restaurants/Restaurants';
import Customers from './Customers/Customers';
import Main from './Main/Main';
import Redeem from './Redeem/Redeem';
import About from './About/About';

function Copyright() {
	return (
	  <Typography variant="body2" color="textSecondary" align="center">
		Produced by Leo Orshansky and Rishabh Bector
	  </Typography>
	);
  }
  
let theme = createMuiTheme({
palette: {
	primary: {
		light: '#63ccff',
		main: '#009be5',
		dark: '#006db3',
	},
	warning: {
		main: '#ff9800',
		light: "#ff9800"
	}
},
typography: {
	h5: {
	fontWeight: 500,
	fontSize: 26,
	letterSpacing: 0.5,
	},
},
shape: {
	borderRadius: 8,
},
props: {
	MuiTab: {
	disableRipple: true,
	},
},
mixins: {
	toolbar: {
	minHeight: 48,
	},
},
});
  
theme = {
...theme,
overrides: {
	MuiDrawer: {
	paper: {
		backgroundColor: '#18202c',
	},
	},
	MuiButton: {
	contained: {
		boxShadow: 'none',
		'&:active': {
		boxShadow: 'none',
		},
	},
	},
	MuiTabs: {
	root: {
		marginLeft: theme.spacing(1),
	},
	indicator: {
		height: 3,
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
		backgroundColor: theme.palette.common.white,
	},
	},
	MuiTab: {
	root: {
		textTransform: 'none',
		margin: '0 16px',
		minWidth: 0,
		padding: 0,
		[theme.breakpoints.up('md')]: {
		padding: 0,
		minWidth: 0,
		},
	},
	},
	MuiIconButton: {
	root: {
		padding: theme.spacing(1),
	},
	},
	MuiTooltip: {
	tooltip: {
		borderRadius: 4,
	},
	},
	MuiDivider: {
	root: {
		backgroundColor: '#404854',
	},
	},
	MuiListItemText: {
	primary: {
		fontWeight: theme.typography.fontWeightMedium,
	},
	},
	MuiListItemIcon: {
	root: {
		color: 'inherit',
		marginRight: 0,
		'& svg': {
		fontSize: 20,
		},
	},
	},
	MuiAvatar: {
	root: {
		width: 32,
		height: 32,
	},
	},
},
};
  
const drawerWidth = 290;
  
const styles = {
	root: {
		display: 'flex',
		minHeight: '100vh',
	},
	drawer: {
		[theme.breakpoints.up('md')]: {
		width: drawerWidth,
		flexShrink: 0,
		},
	},
	app: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	main: {
		flex: 1,
		padding: theme.spacing(6, 4),
		background: '#eaeff1',
	},
	footer: {
		padding: theme.spacing(2),
		background: '#eaeff1',
	},
};

function BenevolentBites (props) {

	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const { classes } = props;

	return (
		<ThemeProvider theme={theme}>
			<div className={classes.root}>
			<CssBaseline />
			<nav className={classes.drawer}>
				<Hidden lgUp implementation="js">
					<Navigator
						PaperProps={{ style: { width: drawerWidth } }}
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
					/>
				</Hidden>
				<Hidden smDown implementation="js">
				<Navigator PaperProps={{ style: { width: drawerWidth } }} />
				</Hidden>
			</nav>
			<Switch>
				<Route path="/restaurants">
					<Restaurants classes={classes} handleDrawerToggle={handleDrawerToggle}/>
				</Route>
				<Route path="/users">
					<Customers handleDrawerToggle={handleDrawerToggle}/>
				</Route>
				<Route path="/redeem">
					<Redeem handleDrawerToggle={handleDrawerToggle}/>
				</Route>
				<Route path="/about">
					<About handleDrawerToggle={handleDrawerToggle}/>
				</Route>
				<Route path="/">
					<Main handleDrawerToggle={handleDrawerToggle}/>
				</Route>
			</Switch>
			</div>
			<footer className={classes.footer}>
				<Copyright />
			</footer>
		</ThemeProvider>
	);
}

BenevolentBites.propTypes = {
	classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(BenevolentBites);