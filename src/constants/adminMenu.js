const data = [
  {
    id: "dashboard",
    icon: "iconsminds-bar-chart-4",
    label: "Dashboard",
    to: `/app/dashboard`,
    key: "DASHBOARD",
  },

  {
    id: "customers",
    icon: "iconsminds-network",
    label: "Clientes",
    to: `/app/clientes`,
    key: "CUSTOMERS",
  },
  {
    id: "providers",
    icon: "iconsminds-engineering",
    label: "Prestadores",
    to: `/app/prestadores`,
    key: "PROVIDERS",
  },
  {
    id: "plans",
    icon: "iconsminds-check",
    label: "Pacotes",
    to: `/app/planos`,
    key: "PLANS",
  },
  {
    id: "services",
    icon: "iconsminds-inbox-into",
    label: "Serviços Solicitados",
    to: `/app/servicos`,
    key: "SERVICES",
  },
  // {
  //   id: "jobs",
  //   icon: "iconsminds-megaphone",
  //   label: "Vagas",
  //   to: `/app/vagas`,
  //   key: "JOBS",
  // },
  {
    id: "administrator",
    icon: "iconsminds-security-settings",
    label: "Administrativo",
    to: `/app/a/modulos`,
    subs: [
      {
        icon: "iconsminds-project",
        label: "Categorias",
        to: `/app/categorias`,
        key: "CATEGORIES",
      },
      {
        icon: "iconsminds-dice",
        label: "Parâmetros",
        to: `/app/a/parametros`,
        key: "PARAMETERS",
      },
      {
        icon: "iconsminds-affiliate",
        label: "Franquias",
        to: `/app/a/franquias`,
        key: "FRANCHISES",
      },
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

      {
        icon: "iconsminds-box-close",
        label: "Módulos",
        to: `/app/a/modulos`,
      },
      {
        icon: "iconsminds-arrow-fork",
        label: "Operações",
        to: `/app/a/operacoes`,
      },
    ],
  },
];
export default data;
