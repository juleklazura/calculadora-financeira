// Funções puras de mês, salário, gastos, caixinhas e séries dos gráficos

export const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export const getDateKey = (date) =>
  `${getMonthKey(date)}-${String(date.getDate()).padStart(2, '0')}`;

export const shiftMonthKey = (key, delta) => {
  const [year, month] = key.split('-').map(Number);
  return getMonthKey(new Date(year, month - 1 + delta, 1));
};

export const formatMonthLabel = (key) => {
  const [year, month] = key.split('-').map(Number);
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const formatMonthShort = (key) => {
  const [year, month] = key.split('-').map(Number);
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
    .format(new Date(year, month - 1, 1));
  return `${label.replace('.', '')}/${String(year).slice(2)}`;
};

// Gasto recorrente vale de startMonth (inclusive) até endMonth (exclusive)
export const isRecurringActive = (template, key) =>
  template.startMonth <= key && (!template.endMonth || key < template.endMonth);

// Salário próprio do mês; senão, herda o salário recorrente mais recente anterior a ele
export const getSalaryInfo = (months, key) => {
  const own = months[key];
  if (own && own.salary !== undefined) {
    return { value: own.salary, recurring: !!own.salaryRecurring };
  }
  const source = Object.keys(months)
    .filter((k) => k < key && months[k].salaryRecurring && months[k].salary !== undefined)
    .sort()
    .pop();
  return source ? { value: months[source].salary, recurring: true } : { value: '', recurring: false };
};

export const sumValues = (list) =>
  list.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);

export const getMonthIncomes = (months, key) => (months[key] || {}).incomes || [];

// Gastos do mês: os lançados nele somados aos recorrentes ativos
export const getMonthExpenses = (months, recurringExpenses, key) => [
  ...((months[key] || {}).expenses || []),
  ...recurringExpenses
    .filter((template) => isRecurringActive(template, key))
    .map((template) => ({
      id: `rec-${template.id}`,
      name: template.name,
      value: template.value,
      category: template.category,
      recurring: true,
    })),
];

// Histórico de valores da caixinha. Registros antigos (sem histórico) começam na data de criação, que é o id
export const getCaixinhaHistorico = (caixinha) =>
  caixinha.historico || [{ data: getDateKey(new Date(caixinha.id)), valor: caixinha.valorAtual || 0 }];

// Registra um novo valor; mais de uma alteração no mesmo dia substitui a anterior
export const registrarValorCaixinha = (caixinha, valor, date = new Date()) => {
  const hoje = getDateKey(date);
  const base = getCaixinhaHistorico(caixinha);
  const last = base[base.length - 1];
  const entry = { data: hoje, valor };
  const historico = last && last.data === hoje ? [...base.slice(0, -1), entry] : [...base, entry];
  return { ...caixinha, valorAtual: valor, historico };
};

// Valor da caixinha ao fim do mês `key`, ou null se ela ainda não existia
const valorCaixinhaEm = (caixinha, key) => {
  let valor = null;
  getCaixinhaHistorico(caixinha).forEach((entry) => {
    if (entry.data.slice(0, 7) <= key) valor = entry.valor;
  });
  return valor;
};

const monthsBetween = (from, to) => {
  const [y1, m1] = from.split('-').map(Number);
  const [y2, m2] = to.split('-').map(Number);
  return (y2 - y1) * 12 + (m2 - m1);
};

// Projeção da caixinha: ritmo médio de aportes mensais (desde o primeiro registro) e mês previsto para atingir a meta
export const projetarCaixinha = (caixinha, currentKey) => {
  const historico = getCaixinhaHistorico(caixinha);
  const primeiro = historico[0];
  const ultimo = historico[historico.length - 1];
  const atual = caixinha.valorAtual || 0;
  const meta = caixinha.meta || 0;
  const taxa =
    (atual - primeiro.valor) /
    Math.max(1, monthsBetween(primeiro.data.slice(0, 7), ultimo.data.slice(0, 7)));
  const concluida = meta > 0 && atual >= meta;

  let dataAlcance = null;
  if (concluida) {
    const registro = historico.find((entry) => entry.valor >= meta);
    dataAlcance = registro ? registro.data.slice(0, 7) : null;
  } else if (meta > 0 && taxa > 0) {
    dataAlcance = shiftMonthKey(currentKey, Math.ceil((meta - atual) / taxa));
  }

  // Valor projetado ao fim do mês `key`; só existe do mês atual até o mês previsto para a meta
  const valorEm = (key) => {
    if (concluida || dataAlcance === null || key < currentKey || key > dataAlcance) return null;
    return Math.min(atual + taxa * monthsBetween(currentKey, key), meta);
  };

  return { taxa, concluida, dataAlcance, valorEm };
};

// Anos selecionáveis no gráfico: até 2 anos passados, o atual e até 2 anos à frente
export const getChartYears = (currentMonth) => {
  const current = Number(currentMonth.slice(0, 4));
  return [current - 2, current - 1, current, current + 1, current + 2];
};

// Meses de um ano (janeiro a dezembro) no formato YYYY-MM
const getYearMonthKeys = (year) =>
  Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);

export const buildEvolution = ({ months, recurringExpenses, caixinhas, year, currentMonth }) => {
  const keys = getYearMonthKeys(year);

  const rows = keys.map((key) => {
    const salario = parseFloat(getSalaryInfo(months, key).value) || 0;
    const rendaExtra = sumValues(getMonthIncomes(months, key));
    const gastos = sumValues(getMonthExpenses(months, recurringExpenses, key));
    return { salario, rendaTotal: salario + rendaExtra, gastos, saldo: salario + rendaExtra - gastos };
  });

  return {
    labels: keys.map(formatMonthShort),
    salario: rows.map((r) => r.salario),
    rendaTotal: rows.map((r) => r.rendaTotal),
    gastos: rows.map((r) => r.gastos),
    saldo: rows.map((r) => r.saldo),
    caixinhas: caixinhas.map((c) => {
      const projecao = projetarCaixinha(c, currentMonth);
      return {
        id: c.id,
        nome: c.nome,
        values: keys.map((key) => valorCaixinhaEm(c, key)),
        projecao: keys.map(projecao.valorEm),
        taxa: projecao.taxa,
        concluida: projecao.concluida,
        dataAlcance: projecao.dataAlcance,
      };
    }),
  };
};
