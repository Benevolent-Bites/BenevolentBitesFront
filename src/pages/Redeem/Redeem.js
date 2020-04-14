import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Typography,
    Paper,
    Grid,
    Button,
    DialogTitle,
    Dialog,
    DialogContent,
    TextField,
    InputAdornment
} from '@material-ui/core'
import { useLocation } from 'react-router-dom';
import { restRedeemCard, frontUrl } from '../../endpoints';
import Header from './Header';

const styles = (theme) => ({
    paper: {
        borderRadius: '10px',
        maxWidth: 420,
        margin: 'auto',
        marginTop: '250px',
        padding: theme.spacing(3.4),
        overflow: 'hidden',
        '& p': {
        fontSize: '1.3rem'
        }
    },
    app: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	main: {
        flex: 1,
		background: '#eaeff1',
	},
    formGrid: {
        marginTop: theme.spacing(3)
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

function Redeem(props) {
    const { classes, handleDrawerToggle } = props;

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [amount, setAmount] = React.useState("");
    const [amountError, setAmountError] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [resultMessage, setResultMessage] = React.useState("");

    const cardId = new URLSearchParams(useLocation().search).get("id");

    const confirm = async () => {
        let error = "";
        let ok = true;
        const response = await window.fetch(
            restRedeemCard(),
            {
                mode: 'cors',
                cache: 'no-cache',
                method: 'POST',
                body: JSON.stringify({
                    password: password,
                    amount: amount * 100,
                    cardId: cardId
                })
            }
        ).then(res => {ok = res.ok;return res.json()}
        ).then(res => {
            if (!ok) {
                throw new Error(res.error);
            }
            return "ok"
        }).catch(err => {error = err});
        if (response) {
            setResultMessage("Redeemed Successfully.");
        } else {
            setResultMessage(error.message);
        }
    }

    const handleAmount = (e) => {
        if (isNaN(e.target.value)) {
            setAmount(e.target.value);
            setAmountError("Not a number");
        } else {
            setAmount(e.target.value);
            setAmountError("");
        }
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const redeem = () => {
        (!!amount && amountError === "") && setDialogOpen(true);
    }

    const handleClose = () => setDialogOpen(false);

	return (
		<div className={classes.app}>
            <Header 
                onDrawerToggle={handleDrawerToggle}
            />  
			<main className={classes.main}>
                
				<Paper className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField className={classes.searchBar} InputProps={{className: classes.searchInput, 
                                startAdornment: <InputAdornment position="start">$</InputAdornment>}} error={!!amountError}
                                label="Amount" value={amount} onChange={handleAmount} 
                                variant="outlined" helperText={amountError}/>
                        </Grid>
                        <Grid item xs/>
                        <Grid item container alignItems="flex-end" xs={5}>
                            <Button variant="contained" color="primary" 
                                onClick={redeem}>Redeem Card 
                                ${!isNaN(parseFloat(amount)) ? parseFloat(amount).toFixed(2) : ""}</Button>
                        </Grid>
                    </Grid>
                </Paper>
                <Dialog maxWidth='xs' fullWidth open={dialogOpen} onClose={handleClose}>
                    <DialogTitle style={{margin: 'auto'}}>Enter Restaurant Password</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{marginBottom: '16px'}}>
                            <Grid item xs={10} sm={8}>
                                <TextField InputProps={{className: classes.searchInput, type: 'password'}} 
                                    variant="outlined" label="Password" value={password} 
                                        onChange={handlePassword} className={classes.searchBar} />
                            </Grid>
                            <Grid item container alignItems="flex-end" xs={6} sm={4}>
                                <Button variant="contained" color="secondary" onClick={confirm}>Confirm</Button>
                            </Grid>
                            {resultMessage && <Typography>{resultMessage}</Typography>}
                        </Grid>
                    </DialogContent>
                </Dialog>
			</main>
		</div>
	);
}

Redeem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Redeem)