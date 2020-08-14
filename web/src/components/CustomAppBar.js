import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  useHistory,
} from 'react-router-dom';

import { Auth } from 'aws-amplify';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import PersonIcon from '@material-ui/icons/Person';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Version from 'components/Version';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    marginRight: theme.spacing(4),
  },
  flexbox: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  unstyledHyperlink: {
    textDecoration: 'none',
    color: 'white',
  },
}));

export default function CustomAppBar({ routes }) {
  const classes = useStyles();
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  function handleToggleMenu() {
    setOpen((prevOpen) => !prevOpen);
  }

  function handleCloseMenu(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }

  async function handleSignOut(event) {
    handleCloseMenu(event);
    try {
      await Auth.signOut();
      history.push('/');
    } catch (e) {
      history.push('/');
    }
  }

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar className={classes.toolbar}>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          <Link to="/dashboard" className={classes.unstyledHyperlink} data-test-id="title">
            幸福存摺
          </Link>
        </Typography>
        {routes.filter((x) => !x.hideFromMenu).map((route) => (
          <Typography key={route.path} component="p" color="inherit" noWrap className={classes.title}>
            <Link to={route.path} className={classes.unstyledHyperlink} data-test-id={route.title}>
              {route.title}
            </Link>
          </Typography>
        ))}
        <div className={classes.flexbox} />
        <Version />
        <IconButton
          ref={anchorRef}
          color="inherit"
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          onClick={handleToggleMenu}
        >
          <PersonIcon />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          disablePortal
        >
          <Paper>
            <ClickAwayListener onClickAway={handleCloseMenu}>
              <MenuList id="user-menu" autoFocusItem={open}>
                {/* <MenuItem onClick={(e) => {
                  handleCloseMenu(e);
                  history.push('/me');
                }}>My Profile</MenuItem> */}
                <MenuItem onClick={handleSignOut}>登出</MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </Toolbar>
    </AppBar >
  );
}

CustomAppBar.propTypes = {
  routes: PropTypes.array.isRequired,
};
