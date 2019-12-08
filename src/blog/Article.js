import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import useOnDocument from '../common/useOnDocument';

const styles = theme => ({
});

function Article(props) {
  const { db, user, match } = props;
  const { userId, articleId } = match.params;
  const pathArticle = `/users/${userId}/articles/${articleId}`;
  const refArticle = db.doc(pathArticle);
  const [ article, err ] = useOnDocument(db, pathArticle);
  const [ sections, setSections ] = useState(null);
  console.log("article=", article);
  useEffect(() => {
    // Note: We can refArticle. Otherwise, useEffect will called for each render.
    const detatcher = db.collection(`${pathArticle}/sections`).onSnapshot((snapshot)=>{
      const newSections = {};
      snapshot.forEach((doc)=>{
        newSections[doc.id] = doc.data();
      });
      console.log("sections", newSections);
      setSections(newSections);
    });
    return detatcher;
  }, [db, pathArticle]);

  async function spliceSections(index, size, sectionId) {
    const newArticle = Object.assign({}, article);
    console.log(article, newArticle);
    if (sectionId) {
      newArticle.sections.splice(index, size, sectionId);
    } else {
      newArticle.sections.splice(index, size);
    }
    console.log(newArticle.sections.length);
    newArticle.updated = new Date();
    //setArticle(newArticle);
    await refArticle.set(newArticle, {merge:true});
  }
  const insertSection = async (resourceId, index, markdown, raw) => {
    const doc = await refArticle.collection("sections").add({
      type: "markdown",
      markdown,
      raw,
      created: new Date(),
      author: user.uid,
    });
    spliceSections(index, 0, doc.id);
  }
  const updateSection = async (resourceId, index, markdown, raw) => {
    await refArticle.collection("sections").doc(resourceId).set({
      markdown, 
      raw
    }, {merge:true})

    const newArticle = Object.assign({}, article);
    newArticle.updated = new Date();
    //setArticle(newArticle);
    await refArticle.set(newArticle, {merge:true});

  }
  const deleteSection = async (resourceId, index) => {
    console.log("deleteSection", resourceId);
    await spliceSections(index, 1);
    await refArticle.collection("sections").doc(resourceId).delete();
  }

  return <p>Artticle {articleId}</p>;

  Article.propTypes = {
    classes: PropTypes.object.isRequired,
    db: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };
}

export default withStyles(styles)(Article);