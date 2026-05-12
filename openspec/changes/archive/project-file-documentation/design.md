# Design - System Mapping Format

## System Map Structure
O arquivo `docs/SYSTEM_MAP.md` será organizado por diretórios, listando cada arquivo relevante com as seguintes informações (baseadas no `/code-annotator`):

### Formato de Entrada por Arquivo
```md
#### [Path/Nome do Arquivo]
- **Tipo**: [componente | hook | service | util | config | rota | token]
- **Papel**: Breve descrição da responsabilidade do arquivo.
- **API/Assinatura**: Principais props ou funções exportadas (para hooks/services).
- **Estado/Ações**: O que o arquivo controla (se aplicável).
- **Regras/Restrições**: Regras específicas de negócio ou arquitetura implementadas.
```

### Categorização
Os arquivos serão agrupados conforme a arquitetura canônica definida em `ARCHITECTURE.md` e `project.md`:
1. **Core & Config**: Configurações de build e tokens globais.
2. **Data Layer**: Services e Prisma.
3. **Logic Layer**: Hooks e Context.
4. **UI Layer**: Components (Atoms, Molecules, Organisms).
5. **Route Layer**: Next.js App Router structure.

## Metadata Tracking
O mapa incluirá uma seção de "Status de Sincronização" para registrar quando foi gerado e contra qual commit/estado do repositório.
