// @component useCompany | @tipo hook | @versao 1.0.0
// > Carrega e persiste o perfil completo da empresa autenticada

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@src/context/AuthContext';
import { CompanyService } from '@src/services/company.service';
import { Company } from '@src/types';

export function useCompany() {
    const { company: authCompany } = useAuth();
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const load = useCallback(async () => {
        if (!authCompany?.id) return;
        setIsLoading(true);
        const data = await CompanyService.getCompany(authCompany.id);
        if (data) setCompany(data);
        setIsLoading(false);
    }, [authCompany?.id]);

    useEffect(() => {
        load();
    }, [load]);

    const updateCompany = useCallback(async (updates: Partial<Company>): Promise<boolean> => {
        if (!authCompany?.id) return false;
        setIsSaving(true);
        const updated = await CompanyService.updateCompany(authCompany.id, updates);
        if (updated) {
            setCompany(updated);
            setIsSaving(false);
            return true;
        }
        setIsSaving(false);
        return false;
    }, [authCompany?.id]);

    return { company, isLoading, isSaving, updateCompany, reload: load };
}