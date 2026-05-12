// @barrel Settings Tab Components | @tipo barrel | @versao 1.0.0
// > Re-exporta tabs de configurações

export { default as SettingsUsersTab } from './SettingsUsersTab';
export { default as SettingsPrivilegesTab } from './SettingsPrivilegesTab';
export { default as SettingsScopeTab } from './SettingsScopeTab';
export { default as SettingsAuditTab } from './SettingsAuditTab';
export { default as SettingsSystemTab } from './SettingsSystemTab';
export type * from './types';

export default function Dummy() { return null; }
