import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './ListGroup.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import { ThemeProvider } from '@emotion/react';
import theme from "./theme";
import Router from './Router';
import reportWebVitals from './reportWebVitals';
import { ClientProvider } from 'components/client';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ClientProvider>
      <Router />
    </ClientProvider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
