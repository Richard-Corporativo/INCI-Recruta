import { useState } from 'react';
import { StorageService, KEYS } from '../lib/storage';
import { SystemSettings } from '../types';

const DEFAULT_SETTINGS: SystemSettings = {
    manager_permissions: {
        move_to_finalist: true,
        mark_not_selected: true,
        return_candidate_stage: false,
        close_job: false
    }
};

export function useSettings() {
    const [settings, setSettings] = useState<SystemSettings>(() => {
        return StorageService.get<SystemSettings>(KEYS.SETTINGS) || DEFAULT_SETTINGS;
    });

    const updateSettings = (newSettings: Partial<SystemSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        StorageService.set(KEYS.SETTINGS, updated);
    };

    const updateManagerPermission = (key: keyof SystemSettings['manager_permissions'], value: boolean) => {
        const updated = {
            ...settings,
            manager_permissions: {
                ...settings.manager_permissions,
                [key]: value
            }
        };
        setSettings(updated);
        StorageService.set(KEYS.SETTINGS, updated);
    };

    return {
        settings,
        updateSettings,
        updateManagerPermission
    };
}
