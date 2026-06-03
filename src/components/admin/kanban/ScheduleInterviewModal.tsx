'use client';
import { Icon } from "@iconify/react";

import React, { useState } from 'react';
import { InterviewService } from '@src/services/interview.service';
import type { Interview } from '@src/types';
import BaseModal from '@src/components/ui/BaseModal';
import { useToast } from '@src/components/ui/Toast';
import CustomSelect from '@src/components/ui/CustomSelect';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateId?: string;
  jobId?: string;
  targetStage?: string;
  onSuccess?: (data?: any) => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, candidateName, candidateId, jobId, targetStage, onSuccess }) => {
  const { error: toastError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Entrevista RH',
    status: 'Agendada',
    date: '',
    time: '',
    interviewer: '',
    location: '',
    address: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (candidateId) {
        const [year, month, day] = formData.date.split('-').map(Number);
        const [hours, minutes] = formData.time.split(':').map(Number);
        const startDate = new Date(year, month - 1, day, hours, minutes, 0);
        const startTime = startDate.toISOString();
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        await InterviewService.addInterview({
          candidate_id: candidateId,
          job_id: jobId,
          title: `${formData.type}: ${candidateName}`,
          description: formData.notes,
          starts_at: startTime,
          ends_at: endDate.toISOString(),
          location: formData.location,
          address: formData.address,
          type: formData.type,
          status: ({ Agendada: 'scheduled', Realizada: 'completed', Cancelada: 'cancelled', Remarcada: 'rescheduled' } as Record<string, Interview['status']>)[formData.status] ?? 'scheduled',
          notes: formData.notes,
          interviewer_names: formData.interviewer,
          stage: targetStage
        });
      }

      onSuccess?.(formData);
      onClose();
    } catch (err: any) {
      console.error('[ScheduleInterviewModal] Erro ao agendar:', err);
      toastError(err?.message || 'Erro ao salvar entrevista. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="relative w-full max-w-xl bg-card rounded-2xl  border border-border overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300 ease-in-out">
        <div className="h-1 w-full bg-primary absolute top-0 left-0"></div>

        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Icon icon="material-symbols:calendar-today" className="" width="20" height="20" />
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
            <Icon icon="material-symbols:close" className="text-[20px]" width="20" height="20" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <form id="schedule-form" className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Tipo de Entrevista</label>
                <CustomSelect
                  value={formData.type}
                  onChange={(type) => setFormData({ ...formData, type })}
                  options={['Entrevista RH', 'Entrevista Técnica', 'Entrevista Gestor', 'Apresentação de Case']}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Status Inicial</label>
                <CustomSelect
                  value={formData.status}
                  onChange={(status) => setFormData({ ...formData, status })}
                  options={['Agendada', 'Realizada']}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Data</label>
                <input
                  required
                  className="w-full h-11 px-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Hora</label>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Entrevistadores</label>
              <div className="relative">
                <Icon icon="material-symbols:group" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]" width="20" height="20" />
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
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Link da Videochamada</label>
              <div className="relative">
                <Icon icon="material-symbols:videocam" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]" width="20" height="20" />
                <input
                  className="w-full h-11 pl-11 pr-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  placeholder="Ex: https://meet.google.com/..."
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Endereço Físico</label>
              <div className="relative">
                <Icon icon="material-symbols:location-on-outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]" width="20" height="20" />
                <input
                  className="w-full h-11 pl-11 pr-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all hover:border-ring"
                  placeholder="Ex: Rua das Flores, 123, Sala 10"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Notas do Agendamento</label>
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
            disabled={isSubmitting}
            className="h-11 px-8 text-sm font-semibold text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon={isSubmitting ? 'material-symbols:hourglass-empty' : 'material-symbols:event-available'} className="text-[18px]" width="18" height="18" />
            {isSubmitting ? 'Salvando...' : 'Confirmar Agendamento'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ScheduleInterviewModal;

