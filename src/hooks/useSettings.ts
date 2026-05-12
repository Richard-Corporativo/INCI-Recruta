'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@src/lib/supabase';
import { SystemSettings } from '@src/types';

const DEFAULT_SETTINGS: SystemSettings = {
    manager_permissions: {
        move_to_finalist: true,
        mark_not_selected: true,
        return_candidate_stage: false,
        close_job: false,
        view_salaries: false
    }
};

export function useSettings() {
    const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    const loadSettings = useCallback(async () => {
        const { data, error } = await supabase
            .from('system_settings')
            .select('*')
            .eq('key', 'manager_permissions')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error loading settings:', error);
        } else if (data) {
            setSettings({ manager_permissions: data.value });
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const updateSettings = async (newSettings: Partial<SystemSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);

        const { error } = await supabase
            .from('system_settings')
            .upsert({
                key: 'manager_permissions',
                value: updated.manager_permissions,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error saving settings:', error);
        }
    };

    const updateManagerPermission = async (key: keyof SystemSettings['manager_permissions'], value: boolean) => {
        const updated = {
            ...settings,
            manager_permissions: {
                ...settings.manager_permissions,
                [key]: value
            }
        };
        setSettings(updated);

        const { error } = await supabase
            .from('system_settings')
            .upsert({
                key: 'manager_permissions',
                value: updated.manager_permissions,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error saving permission:', error);
        }
    };

    return {
        settings,
        updateSettings,
        updateManagerPermission,
        isLoading
    };
}

