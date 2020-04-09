import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import Content from './Content';
import Header from './Header';
import { restLogin, authVerify, getAvatar } from '../../endpoints';

export default function Locations(props) {
	const { classes, handleDrawerToggle } = props;

	const pathDict = {
		'/restaurants':'dashboard',
	};

	const tabValue = pathDict[useLocation().pathname];

	const queryString = new URLSearchParams(window.location.search);

	const [info, setInfo] = React.useState({});
	const [avatarSrc, setAvatarSrc] = React.useState("");
	const initialSignedIn = Cookies.get("signed_in") === "1" || null;
	const [signedIn, setSignedIn] = React.useState(initialSignedIn);
	let needsVerify = false;

	if (!initialSignedIn) {
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
			window.location.assign(restLogin());
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
				<Content />
			</main>
		</div>
	);
}

Locations.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired
};