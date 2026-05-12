---
name: code-annotator
description: Varre o projeto inteiro, anota cada arquivo com marcações estruturadas e para quando terminar. Usar quando pedirem "anotar projeto", "marcar código", "preparar para AI build".
---

# Code Annotator

Autônomo. Sem perguntas. Sem pausas. Para só quando todos os arquivos estiverem anotados.

---

## Execução

### 1. Mapear
Listar todos os arquivos do projeto ignorando:
```
node_modules/ dist/ build/ .next/ .git/ *.lock *.min.js *.generated.*
```

### 2. Planejar
Exibir lista de arquivos a anotar. Formato:
```
[ ] src/components/Button.tsx
[ ] src/hooks/useModal.ts
[ ] src/config/tokens.css
...
```

### 3. Anotar — um arquivo por vez
Para cada arquivo: ler → inserir tags → marcar `[x]` → próximo.
Não esperar confirmação. Não comentar entre arquivos.

### 4. Parar
Quando todos estiverem `[x]`, parar.

---

## Tags

```
// @component Nome — papel
// @tipo componente | hook | store | util | config | rota | token
// @versao x.x.x
// @region Nome
// @end-region
// @api param:tipo, param?:tipo → retorno
// @state nome — o que controla
// @action nome — efeito colateral
// @rule restrição
// @token nome — valor
// @todo [alta|média|baixa] tarefa
// @fix [crítico|médio|baixo] bug
```

---

## Cabeçalho — topo de todo arquivo

```
// @component Nome | @tipo tipo | @versao x.x.x
// > o que faz em meia linha
```

CSS/Python: mesma coisa com `/* */` ou `#`.

---

## Regras de Anotação

- Tag na linha imediatamente acima do que anota
- 3-5 palavras por tag — sem frases completas
- Não anotar o óbvio
- `@region` só em arquivos >60 linhas
- Não escrever nada após terminar cada arquivo
