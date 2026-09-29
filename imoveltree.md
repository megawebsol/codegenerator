 
A correção conceitual principal é:

```text
Imóvel ≠ uma entidade única chamada Property
```

No modelo canônico, o “imóvel” é uma composição de entidades, evidências, papéis e relações ao longo do tempo.

O símbolo legado `Property` aparece em `apps/imobitools/lexicon.yaml`, mas o Domain Pack atual explicitamente rejeita esse modelo monolítico e usa:

```text
LegalPropertyUnit
LandParcel
PhysicalStructure
Building / Condominium
Place
MarketableBundle
```

## Árvore genealógica do ativo imobiliário

```text
REAL ESTATE ASSET
│
├── 1. Unidade jurídica
│   └── LegalPropertyUnit
│       ├── RegistryEvidence
│       │   ├── matrícula
│       │   ├── transcrição
│       │   ├── registro
│       │   ├── cartório competente
│       │   └── documento registral
│       │
│       ├── identificação fiscal/cadastral
│       │   ├── cadastro municipal
│       │   ├── inscrição imobiliária
│       │   ├── cadastro rural, quando aplicável
│       │   └── identificadores externos
│       │
│       ├── OwnershipArrangement
│       │   ├── proprietário PF
│       │   ├── proprietário PJ
│       │   ├── coproprietário PF
│       │   ├── coproprietário PJ
│       │   ├── fração ideal
│       │   ├── titularidade conjunta
│       │   └── representação/procuração
│       │
│       └── RightsAndRestrictions
│           ├── usufruto
│           ├── servidão
│           ├── hipoteca
│           ├── alienação fiduciária
│           ├── penhora
│           ├── indisponibilidade
│           ├── restrição ambiental
│           ├── restrição urbanística
│           └── outros ônus ou direitos
│
├── 2. Base física e territorial
│   ├── LandParcel
│   │   ├── lote
│   │   ├── gleba
│   │   ├── terreno
│   │   ├── área
│   │   ├── confrontações
│   │   ├── fração ideal
│   │   └── parcelamento/origem
│   │
│   ├── PhysicalStructure
│   │   ├── edificação
│   │   ├── casa
│   │   ├── prédio
│   │   ├── torre
│   │   ├── unidade construída
│   │   ├── área construída
│   │   ├── área útil
│   │   ├── reforma
│   │   ├── demolição
│   │   └── ocupação física
│   │
│   ├── Building
│   │   ├── edifício
│   │   ├── torre
│   │   ├── bloco
│   │   └── unidades vinculadas
│   │
│   └── Condominium
│       ├── condomínio edilício
│       ├── condomínio horizontal
│       ├── empreendimento
│       ├── áreas comuns
│       ├── unidades autônomas
│       ├── vagas
│       ├── depósitos
│       └── frações ideais
│
├── 3. Localização
│   └── Place
│       ├── endereço
│       │   ├── logradouro
│       │   ├── número
│       │   ├── complemento
│       │   ├── bairro
│       │   ├── cidade
│       │   ├── estado
│       │   ├── CEP
│       │   └── país
│       │
│       ├── coordenadas
│       ├── georreferenciamento
│       ├── zona/bairro
│       ├── município
│       └── relações espaciais
│
├── 4. Composição comercializável
│   └── MarketableBundle
│       ├── LegalPropertyUnit
│       ├── apartamento/unidade
│       ├── vaga de garagem
│       ├── depósito
│       ├── terreno
│       ├── benfeitorias
│       ├── direitos acessórios
│       └── combinação vendida ou alugada
│
├── 5. Uso, posse e ocupação
│   ├── Possession
│   │   ├── possuidor
│   │   ├── origem da posse
│   │   ├── vigência
│   │   └── fundamento documental
│   │
│   ├── Occupancy
│   │   ├── ocupante PF
│   │   ├── ocupante PJ
│   │   ├── unidade ocupada
│   │   ├── finalidade
│   │   └── período
│   │
│   ├── Tenancy/Lease
│   │   ├── locador
│   │   ├── locatário
│   │   ├── contrato
│   │   ├── vigência
│   │   ├── garantia
│   │   └── obrigações
│   │
│   └── UseRights
│       ├── uso residencial
│       ├── uso comercial
│       ├── uso industrial
│       ├── uso misto
│       └── restrições de uso
│
├── 6. Condomínio e administração
│   └── CondominiumAdministration
│       ├── condomínio
│       ├── administradora
│       ├── síndico
│       ├── subsíndico
│       ├── conselho
│       ├── assembleias
│       ├── convenção
│       ├── regimento interno
│       ├── rateios
│       ├── despesas
│       ├── manutenção
│       ├── inadimplência
│       └── prestação de contas
│
├── 7. Regularidade, licenças e documentos
│   ├── RegulatoryEvidence
│   │   ├── alvará
│   │   ├── licença de construção
│   │   ├── habite-se
│   │   ├── licença ambiental
│   │   ├── aprovação municipal
│   │   ├── AVCB/CLCB
│   │   └── certidões administrativas
│   │
│   ├── TechnicalEvidence
│   │   ├── planta
│   │   ├── memorial descritivo
│   │   ├── laudo
│   │   ├── ART/RRT
│   │   ├── levantamento
│   │   └── avaliação
│   │
│   └── ContractDocument
│       ├── escritura
│       ├── contrato de compra e venda
│       ├── contrato de locação
│       ├── procuração
│       ├── convenção de condomínio
│       ├── aditivo
│       └── documento assinado
│
├── 8. Intermediação imobiliária
│   └── BrokerageMandate
│       ├── autor do mandato
│       │   ├── proprietário PF
│       │   ├── proprietário PJ
│       │   └── representante autorizado
│       │
│       ├── agente/corretor
│       │   ├── corretor PF
│       │   ├── CRECI
│       │   └── papel profissional
│       │
│       ├── imobiliária/agência
│       │   ├── imobiliária A
│       │   ├── imobiliária B
│       │   ├── rede/franquia
│       │   └── parceria
│       │
│       ├── MarketableBundle
│       ├── exclusividade
│       ├── preço mínimo
│       ├── comissão
│       ├── vigência
│       ├── território/canal
│       └── condições do mandato
│
├── 9. Publicação e anúncios
│   └── Listing
│       ├── MarketableBundle anunciado
│       ├── proprietário/mandante
│       ├── corretor responsável
│       ├── imobiliária responsável
│       ├── preço solicitado
│       ├── moeda
│       ├── canal
│       ├── portal
│       ├── fotos
│       ├── descrição
│       ├── disponibilidade
│       ├── Publication
│       └── PublicationStatus
│           ├── draft
│           ├── published
│           ├── suspended
│           ├── sold
│           ├── rented
│           ├── rejected
│           └── vacated
│
├── 10. Demanda e negociação
│   ├── Demand
│   ├── Visit
│   ├── Opportunity
│   ├── Offer
│   │   ├── comprador PF
│   │   ├── comprador PJ
│   │   ├── Listing
│   │   ├── valor
│   │   ├── financiamento
│   │   └── condições
│   │
│   ├── AcceptanceAct
│   └── Agreement
│
└── 11. Fechamento
    └── ClosingCase
        ├── diligência
        ├── análise documental
        ├── financiamento
        ├── escritura
        ├── registro
        ├── pagamento
        ├── Allocation
        ├── Settlement
        ├── transferência de titularidade
        ├── transferência de posse
        ├── comissão
        └── encerramento
```

## Conectores diretos do imóvel

Se o foco for somente o que se conecta diretamente à unidade imobiliária, o núcleo é:

```text
LegalPropertyUnit
├── RegistryEvidence
├── LandParcel
├── PhysicalStructure
├── Place
├── Building/Condominium
├── MarketableBundle
├── OwnershipArrangement
├── RightsAndRestrictions
├── Possession
├── Occupancy
├── CondominiumAdministration
├── RegulatoryEvidence
├── BrokerageMandate
└── Listing
```

Esses são os conectores mais próximos do ativo.

## Relações diretas essenciais

Em forma de grafo:

```text
LegalPropertyUnit
    ├── evidenced_by → RegistryEvidence
    ├── situated_on → LandParcel
    ├── embodied_in → PhysicalStructure
    ├── located_at → Place
    ├── part_of → Building / Condominium
    ├── included_in → MarketableBundle
    ├── owned_by → Person / Organization
    ├── subject_to → Right / Restriction
    ├── possessed_by → Person / Organization
    ├── occupied_by → Person / Organization
    ├── administered_by → Syndic / Administrator
    ├── regulated_by → Permit / License / Certificate
    ├── represented_by → BrokerageMandate
    └── advertised_by → Listing
```

Para uma unidade em condomínio:

```text
LandParcel
    └── contains → Condominium
                     ├── contains → Building
                     │               └── contains → LegalPropertyUnit
                     ├── has_common_area → CommonArea
                     ├── administered_by → CondominiumAdministrator
                     └── represented_by → Syndic
```

Para uma venda:

```text
LegalPropertyUnit
    └── included_in → MarketableBundle
                       ├── represented_by → BrokerageMandate
                       │                    ├── authorized_by → Owner
                       │                    ├── performed_by → Realtor
                       │                    └── held_by → RealEstateAgency
                       │
                       ├── advertised_as → Listing
                       ├── receives → Offer
                       ├── results_in → Agreement
                       └── closes_in → ClosingCase
```

## Proprietários PF/PJ e copropriedade

A relação correta não é:

```text
Property.owner = Person
```

Ela precisa admitir múltiplos titulares e pessoas jurídicas:

```text
LegalPropertyUnit
    └── OwnershipArrangement
        ├── owner → Person
        ├── owner → Person
        ├── owner → Organization
        ├── owner → Organization
        ├── share → 50%
        ├── share → 25%
        ├── share → 25%
        ├── valid_from
        ├── valid_to
        └── RegistryEvidence
```

Exemplo:

```text
Apartamento 1204
├── proprietário PF A: 50%
├── proprietário PF B: 25%
└── empresa PJ C: 25%
```

Também pode existir:

```text
PJ proprietária
    └── representada por → Pessoa física
                            ├── procuração
                            ├── cargo
                            ├── vigência
                            └── capability de assinatura
```

A pessoa que anuncia ou negocia não é necessariamente proprietária:

```text
Owner != Possessor != Occupant != MandateAgent != Realtor != Publisher
```

## Corretores de imobiliárias diferentes

O modelo permite múltiplos agentes e imobiliárias sem duplicar o imóvel:

```text
LegalPropertyUnit
    └── MarketableBundle
        └── BrokerageMandate
            ├── authorized_by → Owner/PJ
            ├── handled_by → Realtor A
            ├── affiliated_with → Imobiliária A
            ├── partnered_with → Imobiliária B
            ├── handled_by → Realtor B
            ├── channel → Portal A
            ├── channel → Portal B
            ├── exclusivity
            └── validity
```

Ou, em mandatos separados:

```text
Owner
├── Mandate 1
│   ├── Realtor A
│   ├── Imobiliária A
│   └── Portal A
│
└── Mandate 2
    ├── Realtor B
    ├── Imobiliária B
    └── Portal B
```

A existência de vários anúncios não significa vários imóveis:

```text
1 MarketableBundle
    ├── Listing A
    ├── Listing B
    ├── Listing C
    └── Publications em portais diferentes
```

## Alvará e documentos

O alvará não deve ser tratado como o imóvel nem como simples propriedade textual:

```text
LegalPropertyUnit
    └── RegulatoryEvidence
        ├── Permit
        ├── License
        ├── Habite-se
        ├── AVCB
        ├── Approval
        └── Certificate
```

O documento pode estar relacionado a:

```text
Permit
    ├── applies_to → LandParcel
    ├── applies_to → PhysicalStructure
    ├── issued_by → Municipality/Authority
    ├── requested_by → Owner/Developer
    ├── represented_by → Architect/Engineer
    ├── valid_from
    ├── valid_to
    └── document_hash
```

Isso evita confundir:

```text
alvará ≠ identidade do imóvel
matrícula ≠ imóvel inteiro necessariamente
endereço ≠ unidade jurídica
anúncio ≠ ativo
proprietário ≠ anunciante
posse ≠ titularidade
ocupação ≠ propriedade
```

## A árvore temporal real

O ativo não tem uma única linha do tempo:

```text
IMÓVEL
├── Linha física
│   ├── terreno
│   ├── construção
│   ├── reforma
│   ├── demolição
│   └── ocupação física
│
├── Linha jurídica
│   ├── matrícula
│   ├── titularidade
│   ├── ônus
│   ├── transferência
│   └── registro
│
├── Linha espacial
│   ├── endereço
│   ├── georreferenciamento
│   ├── parcelamento
│   └── condomínio
│
├── Linha comercial
│   ├── captação
│   ├── mandato
│   ├── anúncio
│   ├── visita
│   ├── oferta
│   ├── contrato
│   └── closing
│
├── Linha financeira
│   ├── preço
│   ├── sinal
│   ├── parcelas
│   ├── financiamento
│   ├── comissão
│   ├── alocação
│   └── liquidação
│
├── Linha documental
│   ├── certidões
│   ├── alvarás
│   ├── laudos
│   ├── contratos
│   ├── assinaturas
│   └── registros
│
└── Linha de publicação
    ├── portais
    ├── canais
    ├── sincronização
    ├── suspensão
    └── remoção
```

## Elementos explicitamente presentes no material consultado

O Domain Pack atual nomeia diretamente:

```text
LegalPropertyUnit
RegistryEvidence
LandParcel
PhysicalStructure
Building
Condominium
Place
MarketableBundle
BrokerageMandate
Listing
Publication
PublicationStatus
Demand
Visit
Opportunity
Offer
AcceptanceAct
Agreement
ContractDocument
Obligation
Payment
Allocation
Settlement
ClosingCase
```

No exemplo `imobitools`, aparecem também:

```text
Person
Enterprise
Condominium
Address
Property
Realtor
Seller
Buyer
Syndic
Mandate
Listing
Offer
Sale
```

E relações:

```text
Occupies
Employs
LocatedAt
UnitOf
Manages
MandateFor
MandateAgent
Lists
ListedBy
OfferOn
OfferBy
SaleOf
SaleFrom
SaleTo
```

A ressalva importante é que `Property` ainda aparece no lexicon legado do `imobitools`, mas o Domain Pack canônico declara a separação correta entre:

```text
LegalPropertyUnit
LandParcel
PhysicalStructure
RegistryEvidence
```

Portanto, para a árvore relacional real, eu usaria `LegalPropertyUnit` como o centro jurídico, não `Property` como entidade monolítica.
