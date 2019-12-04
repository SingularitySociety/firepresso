import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import Grid from '@material-ui/core/Grid';
import MarkdownViewer from './packaged/markdown/MarkdownViewer';
import MarkdownEditor from './packaged/markdown/MarkdownEditor';

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
  const [resource, setResource] = useState({});
  const { classes, user } = props;
  function onSave(markdown, raw) {
    setResource({raw, markdown});
  }
  function onCancel(markdown, raw) {
    // no operation
  }
  return (
    <React.Fragment>
      <Header user={user} login="/Login/target/about" />
      <Grid container justify="center" alignItems="center" direction="row" className={classes.root}>
        <Grid className={classes.contents}>
          <MarkdownEditor resource={resource} onSave={onSave} onCancel={onCancel}/>
          <MarkdownViewer resource={resource} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
