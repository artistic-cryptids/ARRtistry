import { createStyles, Theme } from '@material-ui/core';
import { StyleRules } from '@material-ui/styles/withStyles';

const styles = (theme: Theme): StyleRules => createStyles({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  card: {
    margin: theme.spacing(5, 0, 5, 0), // top right bottom left
    minWidth: 250,
  },
});

export default styles;
