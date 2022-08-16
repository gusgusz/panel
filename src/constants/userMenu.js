const data = [
  {
    id: "testimonials",
    icon: "iconsminds-quill-3",
    label: "Depoimentos",
    to: `/app/depoimentos`,
    key: "TESTIMONIALS",
  },
  {
    id: "customers",
    icon: "iconsminds-network",
    label: "Clientes&Parceiros",
    to: `/app/clientes`,
    key: "CUSTOMERS",
  },
  {
    id: "plans",
    icon: "iconsminds-add-space-after-paragraph",
    label: "Planos",
    to: `/app/planos`,
    subs: [
      {
        icon: "iconsminds-add-space-after-paragraph",
        label: "Planos",
        to: `/app/planos`,
        key: "PLANS",
      },
      {
        icon: "iconsminds-box-with-folders",
        label: "Grupos",
        to: `/app/grupos-de-planos`,
        key: "PLAN-GROUPS",
      },
      {
        icon: "iconsminds-target-market",
        label: "Locais de atuação",
        to: `/app/locais-de-atuacao`,
        key: "LOCALITIES",
      },
    ],
  },
  {
    id: "links",
    icon: "iconsminds-link-2",
    label: "Links",
    to: `/app/links`,
    subs: [
      {
        icon: "iconsminds-link-2",
        label: "Links",
        to: `/app/links`,
        key: "LINKS",
      },
      {
        icon: "iconsminds-blinklist",
        label: "Grupos",
        to: `/app/grupos-de-links`,
        key: "LINK-GROUPS",
      },
    ],
  },

  {
    id: "configuration",
    icon: "iconsminds-security-settings",
    label: "Configuração",
    to: `/app/minha-conta`,
    subs: [
      {
        icon: "iconsminds-male-female",
        label: "Usuários",
        to: `/app/usuarios`,
        key: "USERS",
      },
      {
        icon: "iconsminds-user",
        label: "Perfis de acesso",
        to: `/app/a/perfils-de-acesso`,
        key: "PROFILES",
      },
    ],
  },
  {
    id: "others",
    icon: "iconsminds-folder-add--",
    label: "Outros",
    to: `/app/leads`,
    subs: [
      {
        id: "leads",
        icon: "iconsminds-mail-with-cursors",
        label: "Leads/Contatos",
        to: `/app/leads`,
        key: "LEADS",
      },
      {
        id: "questions",
        icon: "iconsminds-library",
        label: "Perguntas Frequentes",
        to: `/app/perguntas-frequentes`,
        key: "QUESTIONS",
      },
    ],
  },
];
export default data;
