// SPDX-FileCopyrightText: 2026 Воронов Вячеслав Игоревич
// SPDX-License-Identifier: LicenseRef-VSVH-Freeware-EULA
// Proprietary Freeware (Free for Personal & Educational Use). See LICENSE.
// Modification, decompilation and commercial use are prohibited.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
