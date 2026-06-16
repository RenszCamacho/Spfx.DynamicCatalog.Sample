import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { UI_MESSAGES } from '../../constants';

export interface IErrorMessageProps {
  error?: Error;
  message?: string;
}

export const ErrorMessage: React.FC<IErrorMessageProps> = ({ error, message }) => {
  const displayMessage = message || error?.message || UI_MESSAGES.GENERIC_ERROR;
  return (
    <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
      {displayMessage}
    </MessageBar>
  );
};
