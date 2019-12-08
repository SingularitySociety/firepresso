import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import useDocument from '../common/useDocument';

const styles = theme => ({
});

function Article(props) {
  const { db, user, match } = props;
  const { userId, articleId } = match.params;
  const pathArticle = `/users/${userId}/articles/${articleId}`;
  const [ article, err ] = useDocument(db, pathArticle);
  console.log("article=", article);

  return <p>Artticle {articleId}</p>;

  Article.propTypes = {
    classes: PropTypes.object.isRequired,
    db: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };
}

export default withStyles(styles)(Article);