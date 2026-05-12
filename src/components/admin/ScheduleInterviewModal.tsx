// @component ScheduleInterviewModal | @tipo componente | @versao 1.0.0
// > Modal para agendar entrevista — tipo, data, hora, observações
// @api candidateId: string, isOpen: bool, onClose: fn, onSchedule: fn

import React, { useState } from 'react';
import { useAudit } from '@src/hooks/useAudit';
import { useAuth } from '@src/hooks/useAuth';
import { useCandidates } from '@src/hooks/useCandidates';
import BaseModal from '@src/components/shared/BaseModal';
import { Icon } from "@iconify/react";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateId?: string;
  onSuccess?: (data?: any) => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, candidateName, candidateId, onSuccess }) => {
  const { addLog } = useAudit();
  const { user } = useAuth();
  const { updateCandidate } = useCandidates();
  const [formData, setFormData] = useState({
    type: 'Entrevista RH',
    status: 'Agendada',
    date: '',
    time: '',
    interviewer: '',
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (candidateId) {
      updateCandidate(candidateId, {
        nextInterview: {
          type: formData.type,
          date: formData.date,
          time: formData.time
        }
      });
    }

    addLog({
      action: 'Agendamento de Entrevista',
      details: `${formData.type} agendada em ${formData.date} às ${formData.time}. Entrevistador: ${formData.interviewer}. Local: ${formData.location}`,
      user_name: user?.name || 'Sistema',
      entity_type: 'Candidato',
      entity_id: candidateId || candidateName
    });

    onSuccess?.(formData);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="relative w-full max-w-xl bg-card rounded-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300 ease-in-out p-6">
        <div className="h-1 w-full bg-primary absolute top-0 left-0"></div>

        <div className="flex items-center justify-between -b - shrink-0 bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Icon icon="material-symbols:calendar-today" className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground leading-none">Agendar Entrevista</h3>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Candidato: {candidateName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <Icon icon="material-symbols:close" className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <form id="schedule-form" className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tipo de Entrevista</label>
                <select
                  className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option>Entrevista RH</option>
                  <option>Entrevista Técnica</option>
                  <option>Entrevista Gestor</option>
                  <option>Apresentação de Case</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Status Inicial</label>
                <select
                  className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Agendada</option>
                  <option>Realizada</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Data</label>
                <input
                  required
                  className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Hora</label>
                <input
                  required
                  className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Entrevistadores</label>
              <div className="relative">
                <Icon icon="material-symbols:group" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" aria-hidden="true" />
                <input
                  required
                  className="w-full h-11 pl-11 pr-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  placeholder="Ex: João Silva, Maria Souza"
                  type="text"
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Local ou Link da Videochamada</label>
              <div className="relative">
                <Icon icon="material-symbols:videocam" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" aria-hidden="true" />
                <input
                  required
                  className="w-full h-11 pl-11 pr-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  placeholder="Cole o link do Google Meet, Zoom ou sala física..."
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notas do Agendamento</label>
              <textarea
                className="w-full rounded-2xl border border-border bg-background p-4 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring resize-none"
                placeholder="Informações relevantes para o candidato ou entrevistador..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-6 bg-muted/30 border-t border-border">
          <button
            onClick={onClose}
            className="h-11 px-6 text-sm font-semibold text-foreground bg-background border border-border rounded-2xl hover:bg-accent transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="schedule-form"
            className="h-11 px-8 text-sm font-semibold text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
          >
            <Icon icon="material-symbols:event-available" className="h-4 w-4" aria-hidden="true" />
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ScheduleInterviewModal;
