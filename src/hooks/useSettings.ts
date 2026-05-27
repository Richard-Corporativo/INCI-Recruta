'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@src/lib/supabase';
import { getCurrentCompanyId } from '@src/lib/tenant';
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
        const companyId = await getCurrentCompanyId();
        if (!companyId) { setIsLoading(false); return; }

        const { data, error } = await supabase
            .from('system_settings')
            .select('*')
            .eq('key', 'manager_permissions')
            .eq('company_id', companyId)
            .maybeSingle();

        // 42P01 = tabela não existe ainda; PGRST116 = sem linhas — ambos usam o default
        if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
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
        const companyId = await getCurrentCompanyId();
        if (!companyId) return;

        const updated = { ...settings, ...newSettings };
        setSettings(updated);

        const { error } = await supabase
            .from('system_settings')
            .upsert({
                key: 'manager_permissions',
                company_id: companyId,
                value: updated.manager_permissions,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key,company_id' });

        if (error) {
            console.error('Error saving settings:', error);
        }
    };

    const updateManagerPermission = async (key: keyof SystemSettings['manager_permissions'], value: boolean) => {
        const companyId = await getCurrentCompanyId();
        if (!companyId) return;

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
                company_id: companyId,
                value: updated.manager_permissions,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key,company_id' });

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

