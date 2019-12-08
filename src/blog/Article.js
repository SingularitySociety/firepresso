import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
});

function Article(props) {
  const { db, user, match } = props;
  const { articleId } = match.params;

  return <p>Artticle {articleId}</p>;

  Article.propTypes = {
    classes: PropTypes.object.isRequired,
    db: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };
}

export default withStyles(styles)(Article);