# ObjectUI JSON-to-HTML Generator

O gerador compila três artefatos declarativos em um HTML standalone:

```text
Database JSON + Template JSON + Layout JSON
                  ↓
          ObjectUI component tree
                  ↓
              index.html
```

## Gerar a aplicação

```bash
node objectui/generate.mjs \
  data/imobiflow-database.json \
  data/imobiflow-template.json \
  data/imobiflow-layout.json \
  index.html
```

### Fontes

- `data/imobiflow-database.json`: valores dos ativos e relações demonstrativas.
- `data/imobiflow-template.json`: contrato de entidade, campos, coleções e regras.
- `data/imobiflow-layout.json`: navegação, páginas, seções e componentes visuais.

O renderer não contém nomes de entidades imobiliárias nem valores de imóveis. Ele interpreta o component tree gerado pelo compilador e renderiza cards, fields, collections, checklist, summary e review.

## Resultado

`index.html` é autocontido, sem backend e sem dependência de runtime externo. Ele mantém a experiência visual do cadastro ImobiFlow, mas todo o conteúdo é compilado a partir dos três JSONs.

O React Admin em `reactadmin/` é um demo separado para evolução da aplicação operacional; ele não é o gerador do HTML standalone.
