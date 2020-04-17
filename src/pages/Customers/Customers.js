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

function Customers (props) {
	const { classes, handleDrawerToggle, cards, setCards } = props;

	const pathDict = {
		'/users': 'cards'
	};

	const tabValue = pathDict[useLocation().pathname];

	const queryString = new URLSearchParams(window.location.search);

	const [avatarSrc, setAvatarSrc] = React.useState("");

	const initialSignedIn = Cookies.get("signed_in") === "1" || null;
	const [signedIn, setSignedIn] = React.useState(initialSignedIn);
	let needsVerify = false;

	if (!initialSignedIn) {
		console.log(authVerify());
		if (queryString.get("login") === "success") {
			needsVerify = true;
			window.fetch(
				authVerify(),
				{
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
					cache: 'no-cache'
				}
			).then(result => {
				const data = result.json();
				if (!result.ok) {
					throw new Error(data.error)
				}
				return data
			}
			).then(
				result => {
					Cookies.set("signed_in", "1", {expires: 1/24}); // 1/24 days = 1 hour
					window.location.replace(window.location.origin + window.location.pathname);
					setSignedIn(true);
				},
				error => {
					console.log(error);
					setSignedIn(false);
				}
			)
		} else {
			window.location.assign(userLogin());
		}
	}

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
				<ConditionalRender condition={() => needsVerify} alt={
					<Content tabValue={tabValue} cards={cards} setCards={setCards} />
				}>
					<ConditionalRender condition={() => signedIn === true}>
						<Content tabValue={tabValue} cards={cards} setCards={setCards} />
					</ConditionalRender>
					<ConditionalRender condition={() => signedIn === false}>
						<Typography variant="h5">Sorry, please log in again.</Typography>
					</ConditionalRender>
					<ConditionalRender condition={() => signedIn === null}>
							<Spinner size="80px"/>
						</ConditionalRender>
				</ConditionalRender>
			</main>
		</div>
	);
}

Customers.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  cards: PropTypes.array.isRequired,
  setCards: PropTypes.func.isRequired
};

export default withStyles(styles)(Customers);