import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { SystemSettings } from '../types';

const DEFAULT_SETTINGS: SystemSettings = {
    manager_permissions: {
        move_to_finalist: true,
        mark_not_selected: true,
        return_candidate_stage: false,
        close_job: false
    },
    email_templates: {
        received: { subject: 'Candidatura Recebida', body: 'Olá {{name}}, recebemos sua candidatura para a vaga {{job_title}}.', enabled: true },
        screening: { subject: 'Atualização: Triagem Inicial', body: 'Olá {{name}}, seu perfil está em análise para a vaga {{job_title}}.', enabled: true },
        technical: { subject: 'Convite: Teste Técnico', body: 'Olá {{name}}, convidamos você para a etapa técnica da vaga {{job_title}}.', enabled: true },
        hr_interview: { subject: 'Agendamento: Entrevista RH', body: 'Olá {{name}}, queremos agendar uma conversa sobre a vaga {{job_title}}.', enabled: true },
        manager_interview: { subject: 'Agendamento: Entrevista com Gestor', body: 'Olá {{name}}, você avançou para a entrevista com o gestor da vaga {{job_title}}.', enabled: true },
        finalist: { subject: 'Você é Finalista!', body: 'Parabéns {{name}}, você é um dos finalistas para a vaga {{job_title}}.', enabled: true },
        hired: { subject: 'Boas-vindas à Equipe!', body: 'Parabéns {{name}}! Você foi selecionado para a vaga {{job_title}}.', enabled: true },
        rejected: { subject: 'Feedback sobre sua candidatura', body: 'Olá {{name}}, agradecemos seu interesse, mas não seguiremos com seu perfil para a vaga {{job_title}} neste momento.', enabled: true }
    },
    metadata: {
        company_name: 'Minha Empresa',
        portal_url: window.location.origin + '/portal'
    }
};

export function useSettings() {
    const queryClient = useQueryClient();

    const { data: settings = DEFAULT_SETTINGS, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('system_settings')
                .select('*');

            if (error) {
                console.error('Error loading settings:', error);
                throw error;
            }

            const mergedSettings = { ...DEFAULT_SETTINGS };
            data.forEach(item => {
                if (item.key === 'manager_permissions') mergedSettings.manager_permissions = item.value;
                if (item.key === 'email_templates') mergedSettings.email_templates = item.value;
                if (item.key === 'metadata') mergedSettings.metadata = item.value;
            });

            return mergedSettings;
        },
        staleTime: 1000 * 60 * 5,
    });

    const mutation = useMutation({
        mutationFn: async ({ key, value }: { key: string, value: any }) => {
            const { error } = await supabase
                .from('system_settings')
                .upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString()
                });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        }
    });

    const updateManagerPermission = (key: keyof SystemSettings['manager_permissions'], value: boolean) => {
        const newPermissions = {
            ...settings.manager_permissions,
            [key]: value
        };
        mutation.mutate({ key: 'manager_permissions', value: newPermissions });
    };

    const updateEmailTemplates = (templates: SystemSettings['email_templates']) => {
        mutation.mutate({ key: 'email_templates', value: templates });
    };

    const updateMetadata = (metadata: SystemSettings['metadata']) => {
        mutation.mutate({ key: 'metadata', value: metadata });
    };

    return {
        settings,
        updateManagerPermission,
        updateEmailTemplates,
        updateMetadata,
        isLoading
    };
}
