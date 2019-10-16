import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';

class Register extends Component {
    RegisterForm(props) {
        const useStyles = makeStyles(theme => ({
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
        }));
        const classes = useStyles();

        return (
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        R
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register a Piece
                </Typography>
                    <Divider />
                    <Grid container direction="row" spacing={5} align-items="flex-start">
                        <Card className={classes.card}>
                            <CardContent>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    style={{ display: 'none' }}
                                    id="image-upload-button"
                                    multiple
                                    type="file"
                                />
                                <label htmlFor="image-upload-button">
                                    <Button
                                        component="span"
                                        fullWidth
                                        variant="contained"
                                        className={classes.button}
                                    >
                                        Upload Image
                                </Button>
                                </label>
                            </CardContent>
                        </Card>
                        <Grid item xs={12} sm={6}>
                            <form className={classes.form} noValidate>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="pname"
                                            name="pieceName"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="pieceName"
                                            label="Piece Name"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="artistName"
                                            label="Artist Name"
                                            name="artistName"
                                            autoComplete="aname"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            autoComplete="byear"
                                            name="birthYear"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="birthYear"
                                            label="Birth"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            autoComplete="dyear"
                                            name="deathYear"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="deathYear"
                                            label="Death"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="med"
                                            name="medium"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="medium"
                                            label="Medium"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>(* indicates that a field is required)</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={<Checkbox value="shareRecordPublicly" color="primary" />}
                                            label="Share record publicly (you can change this later)"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    + Register
                  </Button>
                            </form>
                        </Grid>
                    </Grid>
                </div>
            </Container >
        );
    }

    componentDidMount() {

    }

    render() {
        return (
            <this.RegisterForm />
        );
    }
}

export default Register;
