import React from 'react';
import MUILink from '@material-ui/core/Link';
import { CompositeDecorator } from 'draft-js';

const linkStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
};

const linkComponent = (props) => {
  const { contentState, entityKey } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <MUILink href={url}>
      {props.children}
    </MUILink>
  );
};

const decorators = [{
  strategy: linkStrategy,
  component: linkComponent,
}];

export default function MarkdownDecorator() {
  return new CompositeDecorator(decorators);
}
