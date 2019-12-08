import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import SubjectIcon from '@material-ui/icons/Subject';
import MUILink from '@material-ui/core/link';
import { Link } from 'react-router-dom';

const styles = theme => ({
  item: {
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
});

function ArticleItem(props) {
  const { classes, article, authorId } = props;

  //console.log(article);
  return (
    <Paper className={classes.item}>
      <MUILink component={Link} 
        to={`/article/${authorId}/${article.articleId}`}>
        <Grid container >
          <Grid item><SubjectIcon /></Grid>
          <Grid item xs={7}>
            { article.title }
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={4}>
          </Grid>
        </Grid>
      </MUILink>
    </Paper>
  )
}

ArticleItem.propTypes = {
    classes: PropTypes.object.isRequired,
    article: PropTypes.object.isRequired,
    authorId: PropTypes.string.isRequired,
  };
  
export default withStyles(styles)(ArticleItem);