import { supabase } from '../../lib/supabase';

export interface AuditEntry {
    user_id?: string;
    user_name?: string;
    action: string;
    entity_type: 'role' | 'job' | 'candidate' | 'user' | 'privilege';
    entity_id: string;
    old_value?: any;
    new_value?: any;
    details?: string;
    category?: string;
    affected_user_id?: string;
    affected_user_name?: string;
}

export const AuditService = {
    async log(entry: AuditEntry) {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('audit_logs')
                .insert([{
                    ...entry,
                    user_id: user?.id,
                    user_name: user?.user_metadata?.name || user?.email || entry.user_name || 'System',
                    timestamp: new Date().toISOString()
                }]);

            if (error) console.error('Error saving audit log:', error);
        } catch (err) {
            console.error('Audit Service Error:', err);
        }
    },

    /**
     * Helper to log changes between two objects
     */
    async logChange(
        entityType: AuditEntry['entity_type'],
        entityId: string,
        action: string,
        oldState: any,
        newState: any,
        category?: string
    ) {
        // Create a diff of only changed fields for the details string
        const changes: string[] = [];
        for (const key in newState) {
            if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
                changes.push(`${key}: ${JSON.stringify(oldState[key])} -> ${JSON.stringify(newState[key])}`);
            }
        }

        return this.log({
            entity_type: entityType,
            entity_id: entityId,
            action,
            old_value: oldState,
            new_value: newState,
            details: changes.length > 0 ? changes.join(', ') : 'No data changes detected',
            category
        });
    }
};
