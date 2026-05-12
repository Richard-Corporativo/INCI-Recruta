// @component CompanyService | @tipo service | @versao 2.0.0
// > Consulta pública e operações autenticadas de empresa (perfil, configurações)
// @api getPublicCompanyBySlug, getCompany, updateCompany
// @references types/index.ts — Company

import { supabase } from '@src/lib/supabase';
import { Company } from '@src/types';

export const CompanyService = {
    async getPublicCompanyBySlug(slug: string): Promise<Company | null> {
        const { data, error } = await supabase
            .from('companies')
            .select('id, name, slug, logo_url, primary_color, status, maintenance_mode, maintenance_message')
            .eq('slug', slug)
            .eq('status', 'active')
            .maybeSingle();

        if (error) {
            console.error(`[CompanyService] Erro ao buscar empresa por slug ${slug}:`, error);
            return null;
        }

        return data as Company | null;
    },

    async getCompany(companyId: string): Promise<Company | null> {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', companyId)
            .maybeSingle();

        if (error) {
            console.error('[CompanyService] Erro ao buscar empresa:', error);
            return null;
        }

        return data as Company | null;
    },

    async updateCompany(companyId: string, updates: Partial<Company>): Promise<Company | null> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, ...safeUpdates } = updates as Company;

        const { data, error } = await supabase
            .from('companies')
            .update({ ...safeUpdates, updated_at: new Date().toISOString() })
            .eq('id', companyId)
            .select()
            .maybeSingle();

        if (error) {
            console.error('[CompanyService] Erro ao atualizar empresa:', error);
            return null;
        }

        return data as Company | null;
    },
};
