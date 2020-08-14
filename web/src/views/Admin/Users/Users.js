import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CognitoUsersTable from 'components/CognitoUsersTable';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2),
  },
}));

export default function Users() {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <CognitoUsersTable />
    </div>
  );
}
