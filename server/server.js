// SPDX-FileCopyrightText: 2026 Воронов Вячеслав Игоревич
// SPDX-License-Identifier: LicenseRef-VSVH-Freeware-EULA
// Proprietary Freeware (Free for Personal & Educational Use). See LICENSE.
// Modification, decompilation and commercial use are prohibited.

import './loadEnv.js';
import { createApp } from './app.js';

const app = createApp();
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});
