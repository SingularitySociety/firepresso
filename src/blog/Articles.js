import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import ArticleList from './ArticleList';
import * as firebase from "firebase/app";
import "firebase/firestore";
import CreateNew from '../common/CreateNew';
import { FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const styles = theme => ({
});

function Articles(props) {
  const { db, user } = props;
  const [redirect, setRedirect] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let query = db.collection(`users/${user.uid}/articles`).orderBy("created", "desc");
    const detacher = query.onSnapshot((snapshot) => {
      const list = [];
      snapshot.forEach((doc)=>{
        const article = doc.data();
        article.articleId = doc.id;
        list.push(article);
      });
      setList(list);
    }, (e) => {
      setError(e);
    });
    return detacher;
  }, [db]);

  const createArticle = async (title) => {
    const doc = await db.collection(`users/${user.uid}/articles`).add({
      title,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: user.uid,
      sections: [], // ordered list of sectionIds
    });
    setRedirect(`/article/${user.uid}/${doc.id}`);
  }

  if (redirect) {
    return <Redirect to={redirect} />
  }
  console.log(list);
  //const context = { user, db };
  return (
    <Grid container justify="center" spacing={1}>
      <Grid item xs={12} style={{textAlign:"center"}}>
        <CreateNew createNew={ createArticle } 
            action={<FormattedMessage id="create" />} label={<FormattedMessage id="article" />}/>
      </Grid>
      <Grid item xs={12}>
      {
        list.map((article)=>{
          return <p key={article.articleId}>{article.title}</p>
          //return <ArticleItem key={article.articleId} article={article} {...context} />
        })
      }
      </Grid>
    </Grid>
  )
}

Articles.propTypes = {
    classes: PropTypes.object.isRequired,
    db: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(Articles);