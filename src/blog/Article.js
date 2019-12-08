import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import useOnDocument from '../common/useOnDocument';
import { Typography, Grid, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import BlogSection from './BlogSection';
import CommonFrame from '../CommonFrame';

const styles = theme => ({
  readerFrame: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  editorFrame: {

  },
  title: {
    fontWeight: "600",
    marginBottom: theme.spacing(2),
    fontSize: "1.4rem",
    '@media (min-width:480px)': {
      fontSize: '1.8rem',
    },
  },
  userFrame: {
    marginBottom: theme.spacing(2),
  },
  userName: {
    //color: "#606060",
    marginLeft: theme.spacing(1),
  },
});

function Article(props) {
  const { db, user, match, classes } = props;
  const { userId, articleId } = match.params;
  const pathArticle = `/users/${userId}/articles/${articleId}`;
  const refArticle = db.doc(pathArticle);
  const [ article, err ] = useOnDocument(db, pathArticle);
  const [ sections, setSections ] = useState(null);
  const [ readOnly, setReadOnly ] = useState(true);
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
  const insertImage = async (index) => {
    console.log("insertImage", index);
    const doc = await refArticle.collection("sections").add({
      type: "image",
      created: new Date(),
      author: user.uid,
    });
    spliceSections(index, 0, doc.id);
  }
  const onImageUpload = async (resourceId, imageUrl) => {
    await refArticle.collection("sections").doc(resourceId).set({
      hasImage: true, imageUrl
    }, {merge:true})
  }
  const toggleReadOnly = () => {
    setReadOnly(!readOnly);
  }

  if (!article || !sections) {
    return ""; // loading...
  }

  const canEdit = (user && article.owner === user.uid);
  const editMode = canEdit && !readOnly;
  const frameClass = canEdit ? classes.editorFrame : classes.readerFrame;
  const context = { pathArticle:refArticle.path };

  return (
    <CommonFrame user={user}>
      <div className={frameClass}>
        <Grid container>
          <Grid item xs={canEdit ? 11 : 12}>
              <Typography component="h1" variant="h1" gutterBottom className={classes.title}>
              {article.title}
            </Typography>
          </Grid>
          {
            canEdit && 
            <Grid item xs={1}>
              <IconButton size="small" onClick={toggleReadOnly}>
                <EditIcon />
              </IconButton>
            </Grid>
          }
        </Grid>
        {
          editMode && 
          <BlogSection index={ 0 } resource={{}} saveSection={insertSection} insertImage={insertImage} {...context} />
        }
        {
          article.sections.map((sectionId, index)=>{
            return <div key={sectionId}>
              <BlogSection index={ index } sectionId={sectionId} resource={ sections[sectionId] } 
                  saveSection={updateSection} deleteSection={deleteSection} 
                  insertImage={insertImage} onImageUpload={onImageUpload} 
                  readOnly={!editMode} {...context} />
              { editMode && <BlogSection index={ index+1 } resource={{}}
                  insertImage={insertImage} saveSection={insertSection} {...context} /> }
            </div>
          })
        }
      </div>
    </CommonFrame>
);
  Article.propTypes = {
    classes: PropTypes.object.isRequired,
    db: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };
}

export default withStyles(styles)(Article);