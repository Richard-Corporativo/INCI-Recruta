import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useJobs } from '../hooks/useJobs';
import DynamicListInput from '../components/DynamicListInput';
import BenefitsSelector from '../components/BenefitsSelector';
import RequirementsSelector from '../components/RequirementsSelector';
import { useRoles } from '../hooks/useRoles';
import { Role } from '../types';
import { JOB_BENEFITS_OPTIONS } from '../constants';
import SLAConfig from '../components/SLAConfig';

interface JobFormData {
  roleTitle: string;
  roleCode: string;
  department: string;
  location: string;
  model: string;
  contract: string;
  urgency: string;
  salaryMin: string;
  salaryMax: string;
  context: string;
  mission: string;
  responsibilities: string;
  responsibility?: string;
  requirements: string[];
  benefits: string[];
  roleId?: string;
  seniority?: string;
  registrationDeadline?: string;
  positionsCount: number;
  workSchedule: string;
  experienceMin?: string;
  reportsTo?: string;
  slaSettings: Record<string, { days: number }>;
}

const CreateJob: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { addJob } = useJobs();
  const { roles } = useRoles();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState<JobFormData>({
    roleTitle: '',
    roleCode: '',
    department: '',
    location: 'Juazeiro do Norte - CE',
    model: 'Híbrido',
    contract: 'CLT',
    urgency: 'Média',
    salaryMin: '',
    salaryMax: '',
    context: '',
    mission: '',
    responsibilities: '',
    requirements: [],
    benefits: [],
    seniority: 'Pleno',
    registrationDeadline: '',
    positionsCount: 1,
    workSchedule: 'Escala 5x2 (44h semanais)',
    experienceMin: '',
    reportsTo: '',
    slaSettings: {
      received: { days: 2 },
      screening: { days: 2 },
      technical: { days: 3 },
      hr_interview: { days: 2 },
      manager_interview: { days: 3 },
      finalist: { days: 5 },
    }
  });

  useEffect(() => {
    if (searchTerm) {
      setFilteredRoles(roles.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setIsDropdownOpen(true);
    } else {
      setFilteredRoles(roles);
    }
  }, [searchTerm, roles]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);

    // Combine technical and behavioral requirements for the job
    const techReqs = role.requirements_technical ? role.requirements_technical.split('\n').filter(Boolean) : [];
    const behReqs = role.requirements_behavioral ? role.requirements_behavioral.split('\n').filter(Boolean) : [];
    const combinedRequirements = [...techReqs, ...behReqs];

    setFormData(prev => ({
      ...prev,
      roleTitle: role.title,
      roleCode: role.code,
      department: role.department,
      mission: role.mission || '',
      responsibilities: role.responsibilities || '',
      roleId: role.id,
      seniority: role.seniority || (role.level ? `Nível ${role.level}` : 'Pleno'),
      requirements: combinedRequirements.length > 0 ? combinedRequirements : (role.requirements ? role.requirements.split('\n').filter(Boolean) : []),
      salaryMin: '0',
      salaryMax: '0',
      experienceMin: role.experience_min || '',
      reportsTo: role.reports_to || ''
    }));
    setSearchTerm(role.title);
    setIsDropdownOpen(false);
  };

  const handlePublish = async () => {
    const newJob = {
      role_id: formData.roleId,
      title: formData.roleTitle,
      context: formData.context || 'Nova oportunidade',
      department: formData.department,
      location: formData.location,
      model: formData.model as any,
      contract: formData.contract as any,
      urgency: formData.urgency as any,
      status: 'Ativa' as const,
      salary_min: Number(formData.salaryMin) || 0,
      salary_max: Number(formData.salaryMax) || 0,
      mission: formData.mission,
      responsibilities: formData.responsibilities,
      requirements: formData.requirements.join('\n'),
      benefits: formData.benefits,
      seniority: formData.seniority,
      candidates_count: 0,
      registration_deadline: formData.registrationDeadline || null,
      positions_count: formData.positionsCount,
      work_schedule: formData.workSchedule,
      experience_min: formData.experienceMin,
      reports_to: formData.reportsTo,
      sla_settings: formData.slaSettings,
      approval_status: 'Pendente' as const // Envia para aprovação
    };

    try {
      await addJob(newJob);
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background transition-colors duration-200 ease-in-out">
      {/* Header */}
      <header className="bg-card border-b border-border pt-8 pb-4 px-8 z-20 shadow-sm shrink-0 sticky top-0 transition-colors">
        <div className="mb-3">
          <Breadcrumbs
            items={[
              { label: 'Vagas', to: '/jobs' },
              { label: 'Criar nova vaga' }
            ]}
          />
        </div>
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight transition-colors">Criar nova vaga</h1>
            <p className="text-muted-foreground text-sm mt-1 transition-colors">Defina os detalhes da nova oportunidade estratégica no sistema.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/jobs')}
              className="h-10 px-6 text-sm font-semibold text-foreground bg-background border border-border rounded-base hover:bg-accent transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-8 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto pb-24">

          {/* Progress Bar */}
          <div className="bg-card border border-border shadow-sm rounded-lg p-6 mb-8 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-[10px] font-semibold text-primary mb-0.5 transition-colors">
                  Passo {step} de 3
                </p>
                <p className="text-base font-semibold text-foreground transition-colors">
                  {step === 1 ? 'Selecionar cargo' : step === 2 ? 'Contexto da vaga' : 'Revisão'}
                </p>
              </div>
              <span className="text-sm font-semibold text-muted-foreground transition-colors">
                {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden transition-colors">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
              ></div>
            </div>
          </div>

          {/* STEP 1: Select Role */}
          {step === 1 && (
            <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden flex flex-col transition-colors">
              <div className="p-6 md:p-8 border-b border-border transition-colors">
                <h3 className="text-foreground font-semibold text-lg mb-6 transition-colors">Qual cargo você deseja contratar?</h3>
                <div className="relative group">
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-2 transition-colors">
                    Selecione um cargo do catálogo <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                      <span className="material-symbols-outlined text-muted-foreground">search</span>
                    </div>
                    <input
                      className="block w-full h-12 pl-12 pr-4 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground transition-all duration-200 ease-in-out outline-none hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Digite o nome do cargo ou código..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                    {isDropdownOpen && filteredRoles.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                        {filteredRoles.map(role => (
                          <div
                            key={role.id}
                            className="px-4 py-3 hover:bg-muted cursor-pointer flex justify-between items-center border-b border-border/50 last:border-0 transition-colors"
                            onClick={() => handleSelectRole(role)}
                          >
                            <div className="transition-all">
                              <div className="font-semibold text-foreground text-sm">{role.title}</div>
                              <div className="text-[10px] text-muted-foreground font-semibold">{role.department} • {role.code}</div>
                            </div>
                            <span className="material-symbols-outlined text-primary text-[20px] opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => navigate('/roles/create')}
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center justify-end gap-1 ml-auto outline-none focus-visible:underline"
                  >
                    + Criar novo cargo no catálogo
                  </button>
                </div>
              </div>

              {selectedRole ? (
                <div className="bg-muted/10 p-6 md:p-8 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-semibold text-muted-foreground transition-colors">Preview do cargo</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 transition-colors">
                      <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                      Ativo
                    </span>
                  </div>
                  <div className="bg-card rounded-lg border border-border p-6 shadow-sm relative overflow-hidden group transition-all duration-200 hover:shadow-md">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h4 className="text-foreground font-semibold text-xl transition-colors">{selectedRole.title}</h4>
                          <p className="text-xs text-muted-foreground font-medium mt-1 transition-colors">Ref: <span className="font-semibold text-foreground">{selectedRole.code}</span></p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 self-start transition-colors">
                          <span className="material-symbols-outlined text-[16px]">domain</span>
                          {selectedRole.department}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border transition-colors">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-muted-foreground">Senioridade / Família</span>
                          <p className="text-sm font-semibold text-foreground transition-colors">{selectedRole.seniority || 'N/A'}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-muted-foreground">Reporta a</span>
                          <p className="text-sm font-semibold text-foreground transition-colors">Gestor da área</p>
                        </div>
                      </div>
                      {selectedRole.mission && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-semibold text-muted-foreground">Missão do cargo</span>
                          <p className="text-sm text-muted-foreground leading-relaxed transition-colors">
                            {selectedRole.mission}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground italic bg-muted/20 text-sm font-medium transition-colors">
                  Selecione um cargo acima para visualizar os detalhes.
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Context */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden h-fit sticky top-24 transition-colors">
                  <div className="p-4 bg-muted/20 border-b border-border transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                      <h2 className="text-foreground font-semibold text-base transition-colors">Conteúdo fixo do cargo</h2>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-md p-3 flex gap-3 items-start transition-colors">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                        Essas informações vêm do <span className="font-semibold text-primary">Catálogo de cargos</span> e não podem ser alteradas aqui.
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-border transition-colors">
                    <details className="group open" open>
                      <summary className="flex justify-between items-center font-semibold cursor-pointer list-none p-4 text-xs text-muted-foreground hover:bg-muted/30 transition-colors outline-none focus-visible:bg-muted">
                        <span>Missão do cargo</span>
                        <span className="transition-transform duration-200 group-open:rotate-180">
                          <span className="material-symbols-outlined text-muted-foreground">expand_more</span>
                        </span>
                      </summary>
                      <div className="text-sm text-foreground px-4 pb-4 animate-in fade-in duration-200 leading-relaxed font-medium transition-colors">
                        {formData.mission}
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex justify-between items-center font-semibold cursor-pointer list-none p-4 text-xs text-muted-foreground hover:bg-muted/30 transition-colors outline-none focus-visible:bg-muted">
                        <span>Responsabilidades</span>
                        <span className="transition-transform duration-200 group-open:rotate-180">
                          <span className="material-symbols-outlined text-muted-foreground">expand_more</span>
                        </span>
                      </summary>
                      <div className="text-sm text-foreground px-4 pb-4 leading-relaxed font-medium transition-colors">
                        <ul className="space-y-2">
                          {formData.responsibilities ? (
                            formData.responsibilities.split('\n').map((item, index) => (
                              <li key={index} className="flex gap-2 items-start">
                                <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5"></span>
                                {item.replace(/^- /, '')}
                              </li>
                            ))
                          ) : (
                            <li className="italic text-muted-foreground">Nenhuma responsabilidade definida no cargo.</li>
                          )}
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-card border border-border shadow-sm p-8 relative rounded-lg transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-primary rounded-t-lg"></div>
                  <div className="mb-8">
                    <h2 className="text-foreground font-semibold text-2xl transition-colors">Contexto da vaga</h2>
                    <p className="text-sm text-muted-foreground font-medium transition-colors">Personalize os detalhes desta abertura específica.</p>
                  </div>
                  <form className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Modelo de trabalho <span className="text-destructive">*</span></label>
                        <select name="model" value={formData.model} onChange={handleInputChange} className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring">
                          <option>Híbrido</option>
                          <option>Presencial</option>
                          <option>Remoto</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Tipo de contrato <span className="text-destructive">*</span></label>
                        <select name="contract" value={formData.contract} onChange={handleInputChange} className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring">
                          <option value="CLT">CLT (Efetivo)</option>
                          <option value="PJ">Pessoa Jurídica (PJ)</option>
                          <option value="Estágio">Estágio</option>
                          <option value="Temporário">Temporário</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Quantidade de vagas <span className="text-destructive">*</span></label>
                        <input
                          name="positionsCount"
                          value={formData.positionsCount}
                          onChange={(e) => setFormData(prev => ({ ...prev, positionsCount: parseInt(e.target.value) }))}
                          className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring"
                          type="number"
                          min="1"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Jornada/Carga horária <span className="text-destructive">*</span></label>
                        <input
                          name="workSchedule"
                          value={formData.workSchedule}
                          onChange={handleInputChange}
                          className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring"
                          placeholder="Ex: Escala 5x2 (44h semanais)"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Período de inscrição</label>
                        <input
                          name="registrationDeadline"
                          value={formData.registrationDeadline}
                          onChange={handleInputChange}
                          className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring"
                          type="date"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                          Localidade do escritório <span className="text-destructive">*</span>
                        </label>
                        <select name="location" value={formData.location} onChange={handleInputChange} className="w-full h-11 h-12 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium hover:border-ring">
                          <option>Juazeiro do Norte - CE</option>
                          <option>Barbalha - CE</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/20 rounded-lg border border-border transition-colors">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">Nível de urgência</label>
                        <div className="flex h-10 p-1 bg-background border border-border rounded-md transition-colors">
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Baixa' }))} className={`flex-1 text-[10px] font-semibold rounded transition-all duration-200 ease-in-out ${formData.urgency === 'Baixa' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`} type="button">Baixa</button>
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Média' }))} className={`flex-1 text-[10px] font-semibold rounded transition-all duration-200 ease-in-out ${formData.urgency === 'Média' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`} type="button">Média</button>
                          <button onClick={() => setFormData(prev => ({ ...prev, urgency: 'Alta' }))} className={`flex-1 text-[10px] font-semibold rounded transition-all duration-200 ease-in-out ${formData.urgency === 'Alta' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`} type="button">Alta</button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-muted-foreground transition-colors">
                          Faixa salarial (Mensal)
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">R$</span>
                            <input
                              name="salaryMin"
                              value={formData.salaryMin}
                              onChange={handleInputChange}
                              className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ease-in-out font-mono"
                              type="number"
                              placeholder="Ex: 1500"
                            />
                          </div>
                          <span className="text-muted-foreground/50 transition-colors">—</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">R$</span>
                            <input
                              name="salaryMax"
                              value={formData.salaryMax}
                              onChange={handleInputChange}
                              className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ease-in-out font-mono"
                              type="number"
                              placeholder="Ex: 3000"
                            />
                          </div>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1 italic font-medium">Insira o valor cheio sem pontos ou vírgulas (Ex: 1500).</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-semibold text-muted-foreground transition-colors">
                        Contexto do projeto / motivo da vaga <span className="text-destructive">*</span>
                      </label>
                      <textarea name="context" value={formData.context} onChange={handleInputChange} className="w-full h-32 rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out font-medium resize-none hover:border-ring placeholder:text-muted-foreground" placeholder="Explique por que essa vaga existe agora..."></textarea>
                    </div>
                    <div className="flex flex-col gap-2">
                      <RequirementsSelector
                        selectedRequirements={formData.requirements}
                        onChange={(items) => setFormData(prev => ({ ...prev, requirements: items }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <SLAConfig
                        settings={formData.slaSettings}
                        onChange={(settings) => setFormData(prev => ({ ...prev, slaSettings: settings }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <BenefitsSelector
                        selectedBenefits={formData.benefits}
                        onChange={(items) => setFormData(prev => ({ ...prev, benefits: items }))}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-foreground transition-colors tracking-tight">Cargo selecionado</h2>
                <div className="bg-card border border-border shadow-sm rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all hover:shadow-md">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0 size-14 shadow-lg transition-all">
                      <span className="material-symbols-outlined text-2xl">badge</span>
                    </div>
                    <div className="flex flex-col transition-colors">
                      <p className="text-foreground text-xl font-semibold">{formData.roleTitle}</p>
                      <p className="text-muted-foreground text-[10px] font-semibold mt-0.5">Ref: {formData.roleCode} • Dept: {formData.department}</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 h-10 px-5 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-base border border-primary/20 transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    Ver detalhes do cargo
                  </button>
                </div>
              </section>

              <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/20 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-primary shrink-0 mt-0.5 animate-pulse">warning</span>
                <div className="flex flex-col gap-1 transition-colors">
                  <p className="text-primary font-semibold text-sm tracking-tight">Atenção importante</p>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    Após publicar, o conteúdo do cargo permanece como referência padrão e os detalhes do contexto serão vinculados a esta oportunidade.
                  </p>
                </div>
              </div>

              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-foreground transition-colors tracking-tight">Resumo do contexto</h2>
                  <button onClick={() => setStep(2)} className="h-9 px-4 text-xs font-semibold text-primary hover:bg-primary/10 rounded-base border border-border bg-background transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring">Editar informações</button>
                </div>
                <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden transition-all hover:shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 p-8 transition-colors">
                    <div className="flex flex-col gap-1.5 transition-colors">
                      <span className="text-[10px] font-semibold text-muted-foreground">Título da vaga</span>
                      <p className="text-foreground font-semibold text-lg">{formData.roleTitle}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 transition-colors">
                      <span className="text-[10px] font-semibold text-muted-foreground">Localização & modelo</span>
                      <p className="text-foreground font-semibold text-lg">{formData.location} • {formData.model}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 transition-colors">
                      <span className="text-[10px] font-semibold text-muted-foreground">Faixa salarial</span>
                      <p className="text-foreground font-semibold text-lg">R$ {formData.salaryMin} — R$ {formData.salaryMax}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 transition-colors">
                      <span className="text-[10px] font-semibold text-muted-foreground">Nível de urgência</span>
                      <div className="flex items-center gap-2">
                        <span className={`size-2.5 rounded-full ${formData.urgency === 'Alta' ? 'bg-primary' : formData.urgency === 'Média' ? 'bg-primary/60' : 'bg-primary/30'} animate-pulse`}></span>
                        <p className="text-foreground font-semibold text-lg">{formData.urgency}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1.5 transition-colors">
                      <span className="text-[10px] font-semibold text-muted-foreground">Justificativa & contexto</span>
                      <p className="text-foreground font-medium leading-relaxed bg-muted/20 p-4 rounded-md border border-border">
                        {formData.context || "Nenhuma justificativa inserida."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </main>

      {/* Footer Actions */}
      <footer className="bg-card border-t border-border p-4 md:px-12 md:py-6 flex items-center justify-end gap-4 z-20 shrink-0 sticky bottom-0 shadow-lg transition-colors duration-200">
        <button
          onClick={() => step === 1 ? navigate('/jobs') : setStep(step - 1)}
          className="flex items-center justify-center gap-2.5 px-6 h-11 rounded-base border border-border bg-background text-foreground font-semibold hover:bg-accent transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Voltar
        </button>
        <div className="flex items-center gap-3">
          {step === 3 ? (
            <>
              <button className="hidden sm:flex items-center justify-center gap-2.5 px-6 h-11 rounded-base text-muted-foreground font-semibold hover:bg-accent hover:text-foreground transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="material-symbols-outlined text-xl">save</span>
                Salvar rascunho
              </button>
              <button
                onClick={handlePublish}
                className="flex items-center justify-center gap-2.5 px-8 h-11 rounded-base bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="material-symbols-outlined text-xl">publish</span>
                Salvar vaga
              </button>
            </>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !selectedRole}
              className="flex items-center justify-center gap-2.5 px-8 h-11 rounded-base bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 transition-all duration-200 ease-in-out active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {step === 1 ? 'Continuar' : 'Revisar e publicar'}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CreateJob;
