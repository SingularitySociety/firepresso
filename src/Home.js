import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './Header';
import { Typography } from '@material-ui/core';
import Articles from './blog/Articles';
import CommonFrame from './CommonFrame';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
    paddingTop: theme.spacing(10),
  },
  caption: {
    textAlign: "center",
    width: "100%",
  },
});

function Home(props) {
  const { classes, user, db } = props;
  const message = (
    <Grid className={classes.caption}>
      <Typography component="h2" variant="h5" gutterBottom>
        Welcome to Firepresso! Please login.
      </Typography>
    </Grid>
  );
  const articles = (
    <Grid className={classes.caption}>
      <Articles user={user} db={db} />
    </Grid>
  );
  return (
    <CommonFrame user={user}>
      { user ? articles : message }
    </CommonFrame>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
