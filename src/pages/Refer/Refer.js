import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { withStyles } from '@material-ui/core/styles';
import {
	Typography
} from '@material-ui/core'
import { useLocation } from 'react-router-dom';
import Content from './Content';
import Header from './Header';
import { ConditionalRender, Spinner } from '../common';
import { userLogin, authVerify, getAvatar } from '../../endpoints';

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

function Refer (props) {
	const { classes, handleDrawerToggle } = props;

	const pathDict = {
		'/refer': 'refer'
	};

	const tabValue = pathDict[useLocation().pathname];

	const [avatarSrc, setAvatarSrc] = React.useState("");

	const signedIn = Cookies.get("signed_in") === "1" || null;

	if (signedIn && avatarSrc === "") {
		window.fetch(
			getAvatar(),
			{
				mode: 'cors',
				credentials: 'include',
				method: 'GET',
				cache: 'no-cache'
			}
		).then(result => {
			if (!result.ok) {
				throw new Error();
			}
			return result.json();
			}
		).then(
			response => {
				setAvatarSrc(response.avatar);
			},
			error => {console.log(error)}
		)
	}

	return (
		<div className={classes.app}>
			<Header 
				onDrawerToggle={handleDrawerToggle} 
				tabValue={tabValue}
				signedIn={signedIn}
				avatarSrc={avatarSrc}
			/>
			<main className={classes.main}>
				<Content tabValue={tabValue} />
			</main>
		</div>
	);
}

Refer.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired
};

export default withStyles(styles)(Refer);