#!/usr/bin/env python3
"""
Script auxiliar para comandos do Virtual Phronesis - Second Brain.
12 comandos que trabalham com o conteúdo REAL do usuário, nunca placeholders.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional


class VirtualPhronesisCommands:
    """Classe principal para processamento de 12 comandos de second brain.
    
    Regra fundamental: NUNCA retornar placeholders genéricos.
    Cada comando DEVE ler arquivos reais e retornar dados contextualizados.
    """
    
    def __init__(self, repository_path: Optional[str] = None):
        self.repository_path = repository_path
    
    def context_load(self, path: Optional[str] = None) -> Dict[str, Any]:
        """Carrega contexto REAL do repositório do usuário.
        
        Retorna: projetos ativos mencionados em notas, prioridades dos últimos 7 dias,
        reflexões recentes com datas e trechos específicos.
        """
        target_path = path or self.repository_path
        
        return {
            "command": "context",
            "path": target_path,
            "instruction": "LEIA os arquivos do repositório antes de responder. Retorne apenas dados encontrados nos arquivos reais.",
            "what_to_find": {
                "active_projects": "Projetos mencionados em notas recentes com status e última atualização",
                "recent_priorities": "Prioridades mencionadas nos últimos 7 dias com datas e contexto",
                "recent_reflections": "Reflexões e insights das últimas notas com trechos citados",
                "unfinished_items": "Tarefas ou compromissos pendentes mencionados pelo usuário"
            },
            "output_requirements": [
                "CITE trechos reais das notas com data de criação",
                "MENCIONE nomes de arquivos onde encontrou a informação",
                "SE não encontrar dados suficientes, diga o que falta",
                "NUNCA invente informações que não estão nos arquivos"
            ]
        }
    
    def today_protocol(self) -> Dict[str, Any]:
        """Gera plano do dia baseado no CONTEÚDO REAL das notas do usuário.
        
        Retorna: prioridades baseadas em menções reais, compromissos do calendário,
        alertas sobre tarefas evitadas.
        """
        today = datetime.now().strftime("%Y-%m-%d")
        
        return {
            "command": "today",
            "date": today,
            "instruction": "LEIA notas diárias, calendário e lista de tarefas. Gere plano baseado no que o usuário REALMENTE disse ser importante.",
            "what_to_find": {
                "mentioned_priorities": "Prioridades mencionadas em notas recentes com datas e frequência de menção",
                "calendar_events": "Compromissos reais do calendário para hoje",
                "unfinished_tasks": "Tarefas de dias anteriores que não foram completadas",
                "avoided_work": "Tarefas que o usuário mencionou mas está evitando (mencione isso)"
            },
            "output_requirements": [
                "CADA prioridade deve ter nota de suporte real (ex: 'você mencionou isso em 2026-03-20')",
                "SE o usuário está evitando algo difícil, ALERTE gentilmente",
                "CONEXE prioridades com o telos (objetivos de longo prazo do usuário)",
                "NUNCA retorne listas genéricas - tudo deve vir do conteúdo real"
            ]
        }
    
    def close_day(self, notes: str = "") -> Dict[str, Any]:
        """Captura o que ACONTECEU hoje baseado em evidências reais.
        
        Retorna: conquistas com base em commits/notas, insights do dia,
        ajustes de hipóteses, reflexão ética.
        """
        return {
            "command": "close-day",
            "instruction": "REVISE commits, notas do dia e calendário. Retorne o que REALMENTE aconteceu, não o que deveria ter acontecido.",
            "what_to_find": {
                "actual_work": "Commits, notas e atividades registradas hoje",
                "insights_from_today": "Insights e reflexões que surgiram hoje (cite trechos)",
                "unfinished_items": "O que ficou pendente e deveria continuar amanhã",
                "virtue_alignment": "Como as ações do dia se alinharam ou desalinharam com virtudes"
            },
            "output_requirements": [
                "CITE horários e fontes (ex: 'commit às 11:23', 'nota das 14:30')",
                "CONECTE com promessas feitas em dias anteriores (ex: 'você disse que faria X')",
                "SE negligenciou algo, diga qual virtude faltou",
                "NUNCA invente atividades que não aconteceram"
            ]
        }
    
    def schedule_week(self, priorities: List[str], calendar: List[str]) -> Dict[str, Any]:
        """Sugere cronograma baseado nas PRIORIDADES REAIS do usuário.
        
        Retorna: alocação de tempo com justificativa baseada em notas,
        conflitos entre intenção e comportamento real.
        """
        today = datetime.now()
        week_start = today - timedelta(days=today.weekday())
        
        return {
            "command": "schedule",
            "week": week_start.strftime("%Y-%m-%d"),
            "instruction": "LEIA prioridades declaradas e calendário real. Sugira alocação de tempo e IDENTIFIQUE conflitos.",
            "what_to_find": {
                "declared_priorities": "O que o usuário disse ser importante (com datas)",
                "actual_calendar": "Compromissos reais já agendados",
                "time_reality": "Como o usuário REALMENTE gasta tempo vs. como diz que quer gastar",
                "conflicts": "Discrepâncias entre prioridades declaradas e uso real do tempo"
            },
            "output_requirements": [
                "CADA bloco de tempo deve ter justificativa baseada em notas do usuário",
                "IDENTIFIQUE conflitos: 'Você diz que X é prioridade, mas gasta tempo com Y'",
                "BASEIE sugestões em padrões reais de produtividade do usuário",
                "NUNCA sugira horários genéricos sem contexto"
            ]
        }
    
    def ghost_analysis(self, repository_data: List[str], question: str) -> Dict[str, Any]:
        """Responde como o USUÁRIO responderia, baseado em seu estilo real.
        
        Retorna: perfil de voz baseado em análise de escrita, resposta no estilo
        identificado com citações de notas que suportam a posição.
        """
        return {
            "command": "ghost",
            "question": question,
            "instruction": "ANALISE a escrita do usuário em suas notas. Identifique padrões de linguagem, raciocínio e valores. Responda NO ESTILO DO USUÁRIO.",
            "what_to_find": {
                "linguistic_patterns": "Vocabulário, estruturas de frase, expressões recorrentes do usuário",
                "reasoning_style": "Como o usuário argumenta (ex: busca de first principles, uso de analogias)",
                "value_signals": "Valores que aparecem consistentemente nas notas",
                "metaphor_usage": "Metáforas e analogias que o usuário usa recorrentemente",
                "position_on_question": "O que o usuário JÁ disse sobre o tema da pergunta"
            },
            "output_requirements": [
                "CITE notas específicas que revelam o estilo do usuário",
                "A RESPOSTA deve soar como se o próprio usuário tivesse escrito",
                "USE vocabulário e metáforas que o usuário realmente usa",
                "SE o usuário nunca abordou o tema, diga isso e use padrões de raciocínio similares"
            ]
        }
    
    def challenge_analysis(self, belief: str, history: List[str]) -> Dict[str, Any]:
        """Testa crenças CONTRA o histórico real do usuário.
        
        Retorna: contradições encontradas em notas passadas, índice de consistência,
        perguntas que forçam justificação.
        """
        return {
            "command": "challenge",
            "belief": belief,
            "instruction": "COMPARE a crença atual com o histórico de notas do usuário. Encontre contradições REAIS, não hipotéticas.",
            "what_to_find": {
                "current_position": "A crença declarada agora",
                "contradictory_notes": "Notas passadas que contradizem a posição atual (com datas e trechos)",
                "consistency_evolution": "Como a posição mudou ao longo do tempo",
                "missing_evidence": "O que o usuário NÃO considerou"
            },
            "output_requirements": [
                "CITE trechos reais que contradizem a posição atual",
                "CALCULE consistência baseada em evidências reais (não chute um número)",
                "FORMULE perguntas baseadas em contradições específicas encontradas",
                "NUNCA concorde sem verificar o histórico primeiro"
            ]
        }
    
    def connect_domains(self, topic_a: str, topic_b: str, notes: List[str]) -> Dict[str, Any]:
        """Encontra conexões REAIS entre dois domínios nas notas do usuário.
        
        Retorna: notas que mencionam ambos os tópicos, links indiretos,
        padrões de conexão identificados.
        """
        return {
            "command": "connect",
            "topic_a": topic_a,
            "topic_b": topic_b,
            "instruction": f"PESQUISE notas sobre '{topic_a}' e '{topic_b}'. Encontre conexões REAIS entre eles.",
            "what_to_find": {
                "direct_connections": "Notas que mencionam AMBOS os tópicos",
                "indirect_links": "Caminhos A→X→B onde X conecta os dois",
                "shared_patterns": "Padrões ou metáforas que aparecem nos dois contextos",
                "unexpected_bridges": "Conexões que o usuário provavelmente não percebeu"
            },
            "output_requirements": [
                "CITE trechos reais que conectam os domínios",
                "NOMEO notas específicas com datas",
                "EXPLIQUE como cada conexão funciona",
                "NUNCA force conexões que não existem nos dados"
            ]
        }
    
    def ideas_generation(self, repository_data: List[str]) -> Dict[str, Any]:
        """Gera ideias baseadas em PADRÕES REAIS do repositório.
        
        Retorna: ferramentas, pessoas, assuntos e escritos sugeridos
        com base em interesses e padrões documentados.
        """
        return {
            "command": "ideas",
            "instruction": "ESCANEIE o repositório por padrões emergentes. Gere ideias baseadas em interesses REAIS documentados.",
            "what_to_find": {
                "emerging_interests": "Tópicos que aparecem com frequência crescente",
                "unexplored_connections": "Intersecções de interesses não exploradas",
                "mentioned_tools": "Ferramentas que o usuário mencionou querer construir",
                "stated_goals": "Objetivos declarados em notas mas não iniciados"
            },
            "output_requirements": [
                "CADA ideia deve ter nota de suporte real (ex: 'baseado em suas 8 notas sobre X')",
                "CITE trechos específicos que revelam o interesse",
                "CONEXE ideias com projetos ou interesses existentes",
                "NUNCA sugira ideias genéricas sem base no repositório"
            ]
        }
    
    def graduate_ideas(self, daily_notes: List[str], days: int = 14) -> Dict[str, Any]:
        """Promove ideias REAIS de notas diárias para arquivos independentes.
        
        Retorna: ideias subdesenvolvidas com trechos originais, contexto,
        conexões e potencial avaliado.
        """
        return {
            "command": "graduate",
            "period": f"Últimos {days} dias",
            "instruction": f"ESCANEIE notas diárias dos últimos {days} dias. Encontre ideias com potencial que merecem espaço próprio.",
            "what_to_find": {
                "underdeveloped_ideas": "Ideias mencionadas de passagem que merecem desenvolvimento",
                "original_context": "O que motivou cada ideia (trecho original com data)",
                "existing_connections": "Notas que já se conectam com cada ideia",
                "development_potential": "Quão desenvolvida cada ideia está"
            },
            "output_requirements": [
                "CITE o trecho EXATO da nota onde a ideia apareceu",
                "INCLUA data e hora da nota original",
                "LISTE conexões reais com outras notas",
                "NUNCA invente ideias que não estão nas notas"
            ]
        }
    
    def emerge_synthesis(self, themes: List[str], data: List[str]) -> Dict[str, Any]:
        """Identifica padrões que estão CRISTALIZANDO nas notas do usuário.
        
        Retorna: clusters de ideias relacionadas com notas específicas,
        fios temáticos e ação recomendada.
        """
        return {
            "command": "emerge",
            "themes": themes,
            "instruction": "ENCONTRE clusters de ideias relacionadas que estão começando a se formar. Nomeie padrões não óbvios.",
            "what_to_find": {
                "idea_clusters": "Grupos de notas que tratam do mesmo tema de ângulos diferentes",
                "latent_connections": "Conexões entre notas que o usuário não articulou explicitamente",
                "thematic_threads": "Fios que percorrem múltiplas notas",
                "ready_to_cristalize": "Padrões que estão prontos para virar projeto/ensaio/produto"
            },
            "output_requirements": [
                "LISTE notas específicas em cada cluster com datas",
                "CITE trechos que revelam o padrão",
                "NOMEIE o padrão de forma que faça sentido para o usuário",
                "SUGIRA ação concreta para cristalizar cada padrão"
            ]
        }
    
    def drift_analysis(self, intentions: List[str], logs: List[str], days: int = 30) -> Dict[str, Any]:
        """Revela temas RECORRENTES não articulados e desalinhamento real.
        
        Retorna: temas que aparecem sem fio claro, comparação intenção vs. comportamento,
        trabalho evitado e racionalizações.
        """
        return {
            "command": "drift",
            "analysis_period": f"Últimos {days} dias",
            "instruction": f"ANALISE notas dos últimos {days} dias. Encontre temas recorrentes não articulados e compare intenções com comportamento real.",
            "what_to_find": {
                "recurring_themes": "Temas/frases que aparecem em notas não relacionadas",
                "intention_vs_reality": "O que o usuário disse que faria vs. o que realmente fez",
                "avoided_work": "Tarefas mencionadas mas nunca realizadas",
                "rationalizations": "Desculpas que o usuário deu para não fazer algo"
            },
            "output_requirements": [
                "CITE notas específicas onde temas aparecem",
                "COMPARE datas de intenção com evidência de ação",
                "IDENTIFIQUE racionalizações com trechos reais",
                "INTERPRETE o que o subconsciente está sinalizando (baseado em dados)"
            ]
        }
    
    def trace_genealogy(self, concept: str, history: List[str]) -> Dict[str, Any]:
        """Rastreia evolução REAL de um conceito nas notas do usuário.
        
        Retorna: primeira menção, fases de evolução com trechos,
        momentos pivotais e estado atual.
        """
        return {
            "command": "trace",
            "concept": concept,
            "instruction": f"RASTREIE todas as menções de '{concept}' nas notas. Mapeie como o conceito evoluiu ao longo do tempo.",
            "what_to_find": {
                "first_mention": "Primeira vez que o conceito aparece (data, arquivo, trecho)",
                "evolution_phases": "Como o entendimento do conceito mudou",
                "pivotal_moments": "Insights que mudaram a perspectiva do usuário",
                "current_state": "Como o usuário usa o conceito agora",
                "connections": "Outros conceitos que se conectaram ao longo do tempo"
            },
            "output_requirements": [
                "CITE trechos reais de CADA fase com data",
                "NOMEO momentos que mudaram o pensamento",
                "MOSTRE a linha do tempo real, não hipotética",
                "SE o conceito aparece pouco, diga isso"
            ]
        }


def format_response(command: str, data: Dict[str, Any]) -> str:
    """Formata resposta para exibição.
    
    IMPORTANTE: O output final NUNCA deve conter placeholders.
    Este formatador retorna apenas a estrutura - o conteúdo real
    vem da leitura dos arquivos do usuário.
    """
    return json.dumps(data, indent=2, ensure_ascii=False)


COMMAND_MAP = {
    "/context": "context_load",
    "/today": "today_protocol",
    "/close-day": "close_day",
    "/schedule": "schedule_week",
    "/ghost": "ghost_analysis",
    "/challenge": "challenge_analysis",
    "/connect": "connect_domains",
    "/ideas": "ideas_generation",
    "/graduate": "graduate_ideas",
    "/emerge": "emerge_synthesis",
    "/drift": "drift_analysis",
    "/trace": "trace_genealogy",
}


if __name__ == "__main__":
    print("=== Virtual Phronesis - 12 Second Brain Commands ===\n")
    print("Comandos disponíveis:")
    for cmd in COMMAND_MAP:
        print(f"  {cmd}")
    print("\nCada comando lê os arquivos REAIS do usuário.")
    print("NUNCA retorne placeholders genéricos.")
