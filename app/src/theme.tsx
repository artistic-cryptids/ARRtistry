interface Styles {
  '@global': any;
  paper: any;
  avatar: any;
  form: any;
  submit: any;
  card: any;
}

const styles = (theme: any): Styles => ({
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
