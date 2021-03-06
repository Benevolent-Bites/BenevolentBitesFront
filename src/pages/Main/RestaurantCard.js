import React from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Paper, Typography, Card, Grid, CardActions, CardMedia,
  CardContent, Button, ButtonGroup, CardHeader, Collapse, Divider, IconButton, useMediaQuery } from '@material-ui/core';
import { ExpandMore, StarRounded, StarBorderRounded, AttachMoneyRounded } from '@material-ui/icons';
import { userBuy, userLogin, restGetPhoto, restRefer } from '../../endpoints';
import clsx from 'clsx';
import { ConditionalRender } from '../common';

export default function RestaurantCard(props) {
  const { classes, data, supported, signedIn, map } = props;

  const [minAmount, medAmount, maxAmount] = [20, 30, 50];

  const [expanded, setExpanded] = React.useState(false);
  const [amount, setAmount] = React.useState(medAmount);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.card} elevation={map ? 0 : 2}>
      <CardHeader
        title={<Typography variant="h6">{data.name}</Typography>}
        subheader={<Typography variant="body1">{data.address}</Typography>}
        disableTypography
      />
      <CardMedia
        component="img"
        height="180"
        image={
          data.image
            ? restGetPhoto() + "?photoreference=" + data.image
            : process.env.PUBLIC_URL + "/img/none.jpg"
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} container alignItems="center" wrap="nowrap">
            <Typography variant="body1" style={{ marginRight: "8px" }}>
              Rating:
            </Typography>
            {Array(Math.round(data.rating))
              .fill()
              .map(() => (
                <StarRounded color="primary" />
              ))}
            {Array(5 - Math.round(data.rating))
              .fill()
              .map(() => (
                <StarBorderRounded color="primary" />
              ))}
            </Grid>
            <Grid item xs={12} container alignItems="center" wrap='nowrap'>
              <Typography style={{marginRight: '8px'}} variant="body1">Price Level:</Typography>
              {Array(Math.round(data.priceLevel)).fill().map(() => 
                <AttachMoneyRounded style={{margin:'-4px'}} color="primary"/>)}
            </Grid>
          </Grid>
        </CardContent>
        {!supported && <Divider style={{backgroundColor: "rgba(0,0,0,0.28)"}}/>}
        <CardActions disableSpacing>
          <ConditionalRender condition={() => supported} alt={<Grid container spacing={1} style={{marginLeft: '8px'}} 
            alignItems="center">
              <Typography variant="body1">Want them on here?</Typography>
              <Button color="primary" component="a" target="_blank" href={restRefer() + "?pid=" + data.restID}>
                Refer Them</Button></Grid>}>
            <Button color="secondary" variant="outlined" style={{marginRight:'15px', textAlign:'center'}} component="a"
              href={`/purchase/${data.restID}`} target="_blank">Purchase Card</Button>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
            onClick={handleExpandClick}
            >
              <ExpandMore />
            </IconButton>
          </ConditionalRender>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider style={{backgroundColor: "rgba(0,0,0,0.28)"}} />
          <CardContent>
            <Typography variant="body1">{data.description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    )
}
