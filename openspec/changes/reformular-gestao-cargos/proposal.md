# Proposta: Reformulação da Gestão de Cargos (Roles)

## Por que
A gestão de cargos atual é simplista. Para escalar, precisamos centralizar a inteligência da empresa (Skills, KPIs, Missão) no Cargo, tornando-o o modelo mestre (template) para as Vagas. Além disso, é crítico separar permissões: Gestores apenas consomem Cargos, enquanto RH/Qualidade definem os padrões.

## O que muda
- Entidade `Role` expandida com campos de detalhes técnicos e comportamentais.
- Introdução de níveis rígidos (Jr/Pl/Sr).
- Restrição de RBAC: `Manager` não edita Cargos.
- Obrigatoriedade de vínculo Job->Role.

## Impacto
- **Capabilities Afetadas:** `role-structure`, `admin-management`.
- **Código:** Schema DB (`roles`), Telas de cadastro de cargo, Lógica de criação de Vaga.
