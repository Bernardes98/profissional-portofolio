export interface PortfolioProject {
  slug: string
  challenge: string
  solution: string
  highlights: string[]
  status: string
  architecture?: { label: string; detail: string }[]
  engineering?: string[]
  number: string
  name: string
  category: string
  year: string
  description: string
  stack: string[]
  accent: string
  kind: 'sales' | 'atelier' | 'perfume'
  url?: string
  gallery?: { src: string; title: string; caption: string; device?: 'mobile' | 'desktop' }[]
}
// Configure URLs públicos reais somente após confirmar seus domínios.
export const projects: PortfolioProject[] = [
  {
    slug: 'gestor-de-vendas', architecture: [{label:'Interface',detail:'Vue + TypeScript + experiência PWA'},{label:'Serviços',detail:'API REST com Java e Spring Boot'},{label:'Operação',detail:'Pedidos, vendas, estoque e notificações'}], engineering: ['Separação entre interface e serviços para facilitar evolução independente.','Experiência multitenant com recursos habilitados conforme a empresa.','Fluxos operacionais que incluem pedidos de produtos e lanches.'], status: 'Produto SaaS', challenge: 'Centralizar rotinas de vendas e pedidos em uma operação simples para negócios de diferentes portes.', solution: 'Aplicação web com API REST, módulos de pedidos, recursos de gestão e experiência PWA.', highlights: ['Gestão de vendas e pedidos', 'Fluxos para fornecedores', 'Notificações de novos pedidos', 'Interface web e experiência PWA'], number: '01', name: 'Gestor de Vendas', category: 'SaaS · Produto próprio', year: '2026',
    description: 'Uma plataforma de gestão que conecta pedidos, vendas, fornecedores e operações em uma experiência centralizada.',
    stack: ['Java', 'Spring Boot', 'Vue', 'TypeScript', 'PWA'], accent: 'violet', kind: 'sales', url: 'https://gestordevendas.online', gallery: [
      {src:'/projects/gestor-dashboard.webp',title:'Visão geral',caption:'Indicadores, vendas recentes e acompanhamento de estoque.'},
      {src:'/projects/gestor-nova-venda.webp',title:'Nova venda',caption:'Registro de vendas com produtos, pagamento e resumo em tempo real.'},
      {src:'/projects/gestor-graficos.webp',title:'Análise de resultados',caption:'Evolução de faturamento e lucro em gráficos.'},
      {src:'/projects/gestor-login-mobile.webp',title:'Acesso mobile',caption:'Interface de autenticação responsiva.',device:'mobile'}
    ]
  },
  {
    slug: 'atelie-tati-retamozo', architecture: [{label:'Vitrine',detail:'Catálogo, personalização e carrinho'},{label:'Aplicação',detail:'API REST e fluxo de checkout'},{label:'Gestão',detail:'Pedidos, pagamentos e prazos'}], engineering: ['Separação entre experiência do cliente e administração dos pedidos.','Regras configuráveis de antecedência para encomendas e retiradas.','Integração de pagamento no fluxo de compra.'], status: 'Projeto real', challenge: 'Levar a experiência de encomenda de doces artesanais para um fluxo digital organizado.', solution: 'E-commerce com catálogo de produtos, personalização, carrinho, checkout e gestão administrativa.', highlights: ['Catálogo e personalização', 'Carrinho e checkout', 'Integração com pagamentos', 'Gestão administrativa'], number: '02', name: 'Ateliê Tati Retamozo', category: 'E-commerce · Projeto real', year: '2026',
    description: 'Experiência digital para confeitaria artesanal: catálogo, personalização, checkout e gestão de pedidos.',
    stack: ['E-commerce', 'API REST', 'Pagamentos', 'UX'], accent: 'rose', kind: 'atelier', url: 'https://atelietatiretamozo.com.br', gallery: [
      {src:'/projects/atelie-v13/home.webp',title:'Página inicial',caption:'Vitrine da confeitaria com identidade visual e produtos em destaque.'},
      {src:'/projects/atelie-v13/bolos.webp',title:'Catálogo de bolos',caption:'Variedade de bolos personalizados e informações de produtos.'},
      {src:'/projects/atelie-v13/docinhos.webp',title:'Catálogo de docinhos',caption:'Doces finos, brownies e caixas para eventos.'},
      {src:'/projects/atelie-v13/presentes.webp',title:'Presentes',caption:'Seleção de produtos para presentear.'},
      {src:'/projects/atelie-v13/contato.webp',title:'Página de contato',caption:'Apresentação da marca e canais de atendimento.'},
      {src:'/projects/atelie-v13/contato-formulario.webp',title:'Formulário de encomenda',caption:'Contato organizado com dados da ocasião e solicitação.'},
      {src:'/projects/atelie-v13/calendario.webp',title:'Calendário de pedidos',caption:'Organização de encomendas por data de retirada ou entrega.'},
      {src:'/projects/atelie-v13/produtos.webp',title:'Gestão de produtos',caption:'Cadastro e manutenção de produtos no painel administrativo.'},
      {src:'/projects/atelie-v13/editar-produto.webp',title:'Edição de produtos',caption:'Edição de dados, imagens e personalização de produtos.'},
      {src:'/projects/atelie-v13/cupons.webp',title:'Cupons e promoções',caption:'Configurações de descontos e campanhas comerciais.'},
      {src:'/projects/atelie-v13/carrossel-categorias.webp',title:'Carrossel de categorias',caption:'Curadoria e ajustes das imagens de categorias.'},
      {src:'/projects/atelie-v13/liquidacao.webp',title:'Liquidação do site',caption:'Regras e períodos de promoções configuráveis.'}
    ]
  },
  {
    slug: 'perfumaria-armelin', architecture: [{label:'API',detail:'Endpoints REST em Spring Boot'},{label:'Domínio',detail:'Entidades e regras de pedidos'},{label:'Proteção',detail:'Configurações de segurança'}], engineering: ['Estruturação inicial da API em camadas.','Evolução incremental das funcionalidades comerciais.'], status: 'Em desenvolvimento', challenge: 'Estruturar uma base robusta para uma aplicação comercial com operações confiáveis.', solution: 'Backend em Java e Spring Boot, priorizando organização da arquitetura, endpoints REST e segurança.', highlights: ['API REST em Java', 'Spring Security', 'Organização por camadas', 'Evolução incremental'], number: '03', name: 'Perfumaria Armelin', category: 'Sistema web · Em desenvolvimento', year: '2026',
    description: 'Construção de uma solução de comércio com API em Java, arquitetura organizada e atenção à segurança.',
    stack: ['Java', 'Spring Boot', 'REST API'], accent: 'gold', kind: 'perfume'
  }
]
