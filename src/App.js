import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
//import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import Home from './Home';
import About from './About';
import Login from './Login';
import Decoder from './Decoder';
import Article from './blog/Article';
import * as firebase from "firebase/app";
import "firebase/firestore";
import config from './config';
import {addLocaleData, IntlProvider} from 'react-intl';
import en from 'react-intl/locale-data/en';
import ja from 'react-intl/locale-data/ja';
import message_en from './locale/en.json';
import message_ja from './locale/ja.json';

firebase.initializeApp(config);
const db = firebase.firestore();

addLocaleData([...en, ...ja]);
const messages = {
  en: message_en,
  ja: message_ja
};
const language = navigator.language.split(/[-_]/)[0];  // language without region code

function App() {
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      async (user) => {
        setUser(user);
        if (user) {
          const refUser = db.collection("users").doc(user.uid);
          const newValue = { lastAccessed:firebase.firestore.FieldValue.serverTimestamp() };
          const doc = (await refUser.get()).data();
          if (!doc || !doc.name) {
            newValue.name = user.displayName;
          }
          await refUser.set(newValue, { merge: true });
        }
      }
    );
    return unregisterAuthObserver;
  }, []);
    
  const params = { user, db };
  return (
    <IntlProvider locale={language} messages={messages[language]}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Route exact path="/" render={(props) => <Home {...props} {...params} />} />
          <Route exact path="/about" render={(props) => <About {...props} {...params} />} />
          <Route exact path="/article/:userId/:articleId" render={(props) => <Article {...props} {...params} />} />
          <Route exact path="/login" render={(props) => <Login {...props} {...params} />} />
          <Route exact path="/login/cmd/:encoded" render={(props) => <Login {...props} {...params} />} />
          <Route exact path="/login/target/:target" render={(props) => <Login {...props} {...params} />} />
          { // We need to mount the Decoder component only after the user info became available.
            (user) ?
              <Route exact path="/decode/:encoded" render={(props) => <Decoder {...props} {...params} />} />
              : "" 
          }
        </Router>
      </MuiThemeProvider>
    </IntlProvider>
  );
}

export default App;
