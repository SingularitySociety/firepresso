import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import MarkdownViewer from './packaged/markdown/MarkdownViewer';
import MarkdownEditor from './packaged/markdown/MarkdownEditor';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
    paddingTop: theme.spacing(10),
  },
  contents: {
    width: "100%",
  },
});

const About = props => {
  const [editing, setEditing] = useState(false);
  const [resource, setResource] = useState({markdown:"Hello **World**"});
  const { classes, user } = props;
  function onSave(markdown, raw) {
    setResource({raw, markdown});
    setEditing(false);
  }
  function onCancel(markdown, raw) {
    setEditing(false);
  }
  function startEditing() {
    setEditing(true);
  }
  function editor() {
    return <MarkdownEditor resource={resource} onSave={onSave} onCancel={onCancel}/>;
  }
  function viewer() {
    return (
      <Grid container justify="center">
        <Grid item xs={11} style={{padding:"1px"}}>
          <MarkdownViewer resource={resource} />
        </Grid>
        <Grid item xs={1}>
          <IconButton size="small" variant="contained" onClick={startEditing}>
            <EditIcon />
          </IconButton>
        </Grid> 
      </Grid>
    );
  }
  return (
    <React.Fragment>
      <Header user={user} login="/Login/target/about" />
      <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
        <Grid className={classes.contents}>
          { editing ? editor() : viewer() }
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
