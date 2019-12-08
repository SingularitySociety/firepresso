import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { FormattedMessage } from 'react-intl';

const styles = theme => ({
  form: {
      marginTop: theme.spacing(1)
  },
  button: {
      margin: theme.spacing(1)
  },
  multiline: {
      width: "100%",
      marginTop: theme.spacing(1),
  }
});

const useStyles = makeStyles(styles);

function CreateNew(props) {
  const classes = useStyles();
  const initialStatus = props.creating || false;
  const [creating, setCreating] = useState(initialStatus);
  const [value, setValue] = useState(props.value || "");

  const setCreatingFlag = (flag) => {
    setCreating(flag);
    setValue("")
  }
  const onChange = (e) => {
    setValue(e.target.value);
  }
  const onSubmit = (e) => {
    e.preventDefault();
    setCreatingFlag(initialStatus);
    props.createNew(value);
  }
  const catchReturn = (e) => {
    if (e.key==='Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.length > 0) {
        onSubmit(e);
      }
    }
  }
  
  const { multiline, label, action, minLength } = props;
  const disabled = value.length < (minLength || 1)
  if (creating) {
    if (multiline) {
      return (
        <form className={classes.form}>
          <TextField onChange={onChange} value={value} autoFocus 
              variant="outlined" label={label || "Channel Name"} 
              multiline={true} rows={2} rowsMax={6} className={classes.multiline}
              onKeyPress={catchReturn} />
          <Button variant="contained" color="primary" className={classes.button} disabled={ disabled }
              onClick={onSubmit} type="submit">{action || "Create"}</Button>
          <Button variant="contained" className={classes.button} disabled={ disabled && initialStatus }
              onClick={()=>setCreatingFlag(initialStatus)}>
              <FormattedMessage id="cancel" />
          </Button>
        </form>
      );
    }
    return (
      <form className={classes.form}>
        <TextField onChange={onChange} value={value} autoFocus 
            variant="outlined" label={label || "Channel Name"} />
        <Button variant="contained" color="primary" className={classes.button} 
            disabled={ disabled }
            onClick={onSubmit} type="submit">{action || "Create"}</Button>
        <Button variant="contained" className={classes.button} disabled={ disabled && initialStatus }
            onClick={()=>setCreatingFlag(initialStatus)}>
            <FormattedMessage id="cancel" />
        </Button>
      </form>
    );
  }
  return (
    <Fab variant="extended" color="primary" onClick={()=>setCreatingFlag(true)}>
      <AddIcon />{label}
    </Fab>
  );
}

CreateNew.propTypes = {
  createNew: PropTypes.func.isRequired,
};
  
export default CreateNew;