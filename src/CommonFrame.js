import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './Header';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  main: {
    width: "100%",
    padding: theme.spacing(1),
    '@media (min-width:480px)': {
      paddingTop: theme.spacing(3),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
      maxWidth: "50rem",
    },
  }
});

function CommonFramme(props) {
  const { classes, user } = props;
  return (
    <React.Fragment>
      <Header user={user} />
      <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
        <Grid item className={ classes.main }>
          { props.children }
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

CommonFramme.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommonFramme);
