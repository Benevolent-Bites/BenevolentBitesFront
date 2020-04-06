import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { withStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import Content from './Content';
import Header from './Header';

const drawerWidth = 290;
const styles = (theme) => ({
	root: {
		display: 'flex',
		minHeight: '100vh',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
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
});

function Main(props) {
	const { classes, handleDrawerToggle } = props;

	const pathDict = {
		'/':'map',
		'/list': 'list'
	};

	const tabValue = pathDict[useLocation().pathname];
	
	const signedIn = Cookies.get("signed_in") === "1" || false;

	return (
		<div className={classes.app}>
			<Header 
				onDrawerToggle={handleDrawerToggle} 
				tabValue={tabValue}
				signedIn = {signedIn}
			/>
			<main className={classes.main}>
				<Content signedIn={signedIn} classes={classes} tabValue={tabValue}/>
			</main>
		</div>
	);
}

Main.propTypes = {
	classes: PropTypes.object.isRequired,
	handleDrawerToggle: PropTypes.func.isRequired
};
  
export default withStyles(styles)(Main);