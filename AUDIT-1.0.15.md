# Auditoria Meu PC 1.0.15

- Nome do projeto e app: Meu PC
- Versão: 1.0.15
- Home refatorada: comparador e regras de upgrade extraídos
- Persistência: centralizada em `src/services/storage.js`
- Backup: formato v2, compatível com v1, inclui peças editadas
- Domínio de peças: cálculos e buscas em `src/domain/parts.js`
- Compatibilidade: plataforma, RAM, gabinete e fonte
- Upgrade/gargalo: heurística de custo-benefício e equilíbrio relativo
- Testes: 9 testes automatizados aprovados com `node --test`
- Build Vite: não executado localmente porque o ZIP não continha `node_modules` e a instalação de dependências não concluiu neste ambiente
