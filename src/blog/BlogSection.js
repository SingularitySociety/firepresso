import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import EditIcon from '@material-ui/icons/Edit';
import MarkdownViewer from '../packaged/markdown/MarkdownViewer';
import MarkdownEditor from '../packaged/markdown/MarkdownEditor';
import ImageUploader from '../common/ImageUploader';

function BlogSection(props) {
  const [editing, setEditing] = useState(false);
  const { sectionId, index, resource, readOnly, pathArticle } = props;

  function onSave(markdown, raw) {
    props.saveSection(sectionId, index, markdown, raw);
    setEditing(false);
  }
  function onCancel() {
    setEditing(false);
  }
  function onDelete() {
    props.deleteSection(sectionId, index);
  }
  function startEditing() {
    setEditing(true);
  }
  function insertImage() {
    props.insertImage(index);
  }
  function onImageUpload(imageUrl) {
    props.onImageUpload(sectionId, imageUrl);
  }

  if (editing) {
    return (
      <MarkdownEditor resource={resource} onSave={onSave} onCancel={onCancel} onDelete={props.deleteSection && onDelete} />
    )
  }

  if (sectionId) {
    if (resource.type==="image") {
      if (readOnly && !resource.hasImage) {
        return "";
      }
      const imagePath = `${pathArticle}/${sectionId}`;
      const thumbnails = (resource[sectionId] && resource[sectionId].thumbnails) || resource.thumbnails
      return (
          <ImageUploader imagePath={imagePath} loadImage={resource.hasImage} imageUrl={resource.imageUrl}
            imageThumbnails={thumbnails} 
            readOnly={readOnly} displayMode="wide" onImageUpload={onImageUpload} deleteImage={onDelete} />
      );
    }
    
    const textWidth = readOnly ? 12 : 11;
    return <Grid container justify="center">
      <Grid item xs={textWidth} style={{padding:"1px"}}>
        <MarkdownViewer resource={resource} />
      </Grid>
      { !readOnly &&
        <Grid item xs={1}>
          <IconButton size="small" variant="contained" onClick={startEditing}>
            <EditIcon />
          </IconButton>
        </Grid> 
      }
    </Grid>
  }

  return <Grid container justify="center">
    <Grid item>
      <IconButton  size="small" variant="contained" onClick={startEditing}>
        <AddIcon />
      </IconButton>
    </Grid> 
    <Grid item>
      <IconButton  size="small" variant="contained" onClick={insertImage}>
        <PhotoIcon />
      </IconButton>
    </Grid> 
  </Grid>
}

BlogSection.propTypes = {
  insertImage: PropTypes.func.isRequired,
  saveSection: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  pathArticle: PropTypes.string.isRequired,
};
  
export default BlogSection;