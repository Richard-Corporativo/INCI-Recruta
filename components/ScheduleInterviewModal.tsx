import React, { useState } from 'react';
import { useAudit } from '../hooks/useAudit';
import { useAuth } from '../hooks/useAuth';
import BaseModal from './BaseModal';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, candidateName }) => {
  const { addLog } = useAudit();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'Entrevista Gestor',
    status: 'Agendada',
    date: '',
    time: '',
    interviewer: '',
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLog({
      action: 'Agendamento de Entrevista',
      details: `Entrevista ${formData.type} agendada para ${candidateName} em ${formData.date} às ${formData.time}`,
      user_name: user?.name || 'Sistema',
      entity_type: 'Candidato',
      entity_id: candidateName // No futuro usar ID
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0 bg-card">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-lg font-bold text-foreground leading-none">Agendar Entrevista</h3>
            <p className="text-xs text-muted-foreground font-bold">Candidato: {candidateName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-base p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-foreground bg-card">
          <form id="schedule-form" className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Tipo de Entrevista</label>
                <select
                  className="w-full rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option>Entrevista RH</option>
                  <option>Entrevista Gestor</option>
                  <option>Entrevista Técnica</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Status</label>
                <select
                  className="w-full rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Agendada</option>
                  <option>Realizada</option>
                  <option>Remarcada</option>
                  <option>Cancelada</option>
                  <option>Faltou</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Data</label>
                <input
                  className="w-full rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Hora</label>
                <input
                  className="w-full rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Entrevistador</label>
              <input
                className="block w-full rounded-md border border-border bg-background py-2 px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200"
                placeholder="Nome do entrevistador"
                type="text"
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Local ou Link</label>
              <input
                className="block w-full rounded-md border border-border bg-background py-2 px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200"
                placeholder="Cole o link da reunião ou sala..."
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Observações</label>
              <textarea
                className="block w-full rounded-md border border-border bg-background py-2 px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all duration-200 placeholder:text-muted-foreground"
                placeholder="Instruções para o candidato ou notas internas..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4 bg-muted/30 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-foreground bg-background border border-border rounded-base hover:bg-muted transition-all duration-200 active:translate-y-[1px]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="schedule-form"
            className="px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary border border-border/40 hover:bg-primary/90 rounded-base shadow-sm transition-all duration-200 flex items-center gap-2 active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="material-symbols-outlined text-[18px]">event_available</span>
            Salvar Agendamento
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ScheduleInterviewModal;
