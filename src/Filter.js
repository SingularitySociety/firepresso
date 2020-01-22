import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as firebase from "firebase/app";
import "firebase/firestore";
import CreateNew from './common/CreateNew';
import { FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import ArticleItem from './blog/ArticleItem';
import { Redirect } from 'react-router-dom';
import CommonFrame from './CommonFrame';
import { Typography } from '@material-ui/core';

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

function Articles(props) {
  const { db, user } = props;
  const [redirect, setRedirect] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=>{
    //let query = db.collectionGroup(`articles`).where('category', '==', 'firebase').orderBy("created", "desc");
    let query = db.collectionGroup(`articles`).orderBy("created", "desc");
    const detacher = query.onSnapshot((snapshot) => {
      console.log(snapshot);
      const list = [];
      snapshot.forEach((doc)=>{
        const path = doc.ref.path
        const authourId = path.split('/')[1]
        const article = doc.data();
        article.articleId = doc.id;
        article.authorId = authourId;
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

  const newArticle = (
    <Grid item xs={12} style={{textAlign:"center"}}>
      <CreateNew createNew={ createArticle }
          action={<FormattedMessage id="create" />} label={<FormattedMessage id="article" />}/>
    </Grid>
  );

  const welcomeMessage = (
    <Grid container justify="center">
      <Grid item xs={12} style={{textAlign:"center"}}>
        <Typography variant='h4'>
          Welcome to Firepresso!
        </Typography>
      </Grid>
      <Grid item xs={12} style={{textAlign:"center"}}>
        <Typography variant='body1' paragraph>
          Please login to write articles!
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <CommonFrame user={user}>
      <Grid container justify="center" spacing={1}>

        { user ? newArticle : welcomeMessage }

        <Grid item xs={12}>
        {
          list.map((article)=>{
            return <ArticleItem key={article.articleId}
                      article={article} authorId={article.authorId} />
          })
        }
        </Grid>
      </Grid>
    </CommonFrame>
  )
}

Articles.propTypes = {
    classes: PropTypes.object.isRequired,
    db: PropTypes.object.isRequired,
    user: PropTypes.object,
  };

export default withStyles(styles)(Articles);
