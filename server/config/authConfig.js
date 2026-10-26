// SPDX-FileCopyrightText: 2026 Воронов Вячеслав Игоревич
// SPDX-License-Identifier: LicenseRef-VSVH-Freeware-EULA
// Proprietary Freeware (Free for Personal & Educational Use). See LICENSE.
// Modification, decompilation and commercial use are prohibited.

/**
 * @returns {string}
 */
export function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || !String(s).trim()) {
    throw new Error('JWT_SECRET is required');
  }
  return String(s).trim();
}

/** @returns {string} jsonwebtoken `expiresIn` (e.g. `7d`) */
export function getJwtExpiresIn() {
  const v = process.env.JWT_EXPIRES_IN;
  if (v && String(v).trim()) {
    return String(v).trim();
  }
  return '7d';
}
