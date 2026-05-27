# 🟢 Guia de Execução das Propostas (Workflow OpenSpec)

Este documento orienta o usuário sobre como **gerenciar e finalizar** as 7 propostas criadas no sistema OpenSpec. Siga este fluxo para cada item, um por vez.

Para cada proposta, o ciclo de execução é:
1.  **Validar**: Garantir que a estrutura está correta.
2.  **Revisar**: Ler o plano de tarefas gerado.
3.  **Arquivar**: Oficializar a mudança (transforma a proposta em *Spec* oficial do sistema e move para histórico).

---

## Ordem

### 1. `implementar-banco-talentos`
*Foco: Permitir candidatos sem vaga e mover salário para jobs.*

1.  **Validar integridade:**
    ```bash
    openspec validate implementar-banco-talentos --strict
    ```
2.  **Aplicar (Implementar Código):**
    ```bash
    openspec apply implementar-banco-talentos
    ```
3.  **Arquivar (Oficializar):**
    ```bash
    openspec archive implementar-banco-talentos
    ```

### 2. `reformular-gestao-cargos`
*Foco: Novos campos de Cargo, Níveis (Jr/Pl/Sr) e RBAC.*

1.  **Validar:**
    ```bash
    openspec validate reformular-gestao-cargos --strict
    ```
2.  **Aplicar:**
    ```bash
    openspec apply reformular-gestao-cargos
    ```
3.  **Arquivar:**
    ```bash
    openspec archive reformular-gestao-cargos
    ```

### 3. `implementar-workflow-vagas`
*Foco: State Machine (Rascunho->Publicada) e Auditoria de Diff.*

1.  **Validar:**
    ```bash
    openspec validate implementar-workflow-vagas --strict
    ```
2.  **Aplicar:**
    ```bash
    openspec apply implementar-workflow-vagas
    ```
3.  **Arquivar:**
    ```bash
    openspec archive implementar-workflow-vagas
    ```

### 4. `criar-motor-busca-candidatos`
*Foco: Busca unificada por Skills e Salário.*

1.  **Validar:**
    ```bash
    openspec validate criar-motor-busca-candidatos --strict
    ```
2.  **Aplicar:**
    ```bash
    openspec apply criar-motor-busca-candidatos
    ```
3.  **Arquivar:**
    ```bash
    openspec archive criar-motor-busca-candidatos
    ```

### 5. `implementar-sla-forecast`
*Foco: Tracking de tempo, Farol (SLA) e Previsão.*

1.  **Validar:**
    ```bash
    openspec validate implementar-sla-forecast --strict
    ```
2.  **Aplicar:**
    ```bash
    openspec apply implementar-sla-forecast
    ```
3.  **Arquivar:**
    ```bash
    openspec archive implementar-sla-forecast
    ```

### 6. `implementar-analytics-diversidade`
*Foco: Dashboards de funil e dados demográficos.*

1.  **Validar:**
    ```bash
    openspec validate implementar-analytics-diversidade --strict
    ```
2.  **Aplicar:**
    ```bash
    openspec apply implementar-analytics-diversidade
    ```
3.  **Arquivar:**
    ```bash
    openspec archive implementar-analytics-diversidade
    ```

### 7. `implementar-central-comunicacao`
*Foco: Envio de e-mail e templates no perfil.*

1.  **Validar:**
    ```bash
    openspec validate implementar-central-comunicacao --strict
    ```
2.  **Aplicar:**
    ```bash
    openspec apply implementar-central-comunicacao
    ```
3.  **Arquivar:**
    ```bash
    openspec archive implementar-central-comunicacao
    ```

---

## Resumo dos Comandos Úteis

| Ação | Comando |
| :--- | :--- |
| **Listar todas as propostas** | `openspec list` |
| **Ver detalhes de uma** | `openspec show <id>` |
| **Validar uma** | `openspec validate <id> --strict` |
| **Aplicar (Implementar)** | `openspec apply <id>` |
| **Arquivar (Concluir)** | `openspec archive <id>` |

**Nota:** O comando `openspec apply` sinaliza para o Agente ou para o sistema iniciar a implementação das tarefas descritas em `tasks.md`. O passo `archive` deve ser rodado somente **após** a implementação estar concluída e validada.
