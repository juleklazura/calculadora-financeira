import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Header from './components/Header';
import FinanceCalculator from './components/FinanceCalculator';
import Summary from './components/Summary';
import Caixinhas from './components/Caixinhas';
import Charts from './components/Charts';
import MonthNavigator from './components/MonthNavigator';
import {
  getMonthKey,
  shiftMonthKey,
  formatMonthLabel,
  isRecurringActive,
  getSalaryInfo,
  getMonthIncomes,
  getMonthExpenses,
  sumValues,
  registrarValorCaixinha,
  buildEvolution,
  getChartYears,
} from './utils/finance';

// Encerra recorrências ativas no mês `key` (todas, ou só a de `id`) a partir desse mês
const stopRecurring = (list, key, id = null) => list.reduce((acc, template) => {
  if (!isRecurringActive(template, key) || (id !== null && template.id !== id)) return [...acc, template];
  if (template.startMonth === key) return acc;
  return [...acc, { ...template, endMonth: key }];
}, []);

// Edita um gasto recorrente a partir de `key`: meses anteriores mantêm os valores antigos
const editRecurring = (list, key, id, updated) => list.flatMap((template) => {
  if (template.id !== id || !isRecurringActive(template, key)) return [template];
  if (template.startMonth === key) return [{ ...template, ...updated }];
  return [
    { ...template, endMonth: key },
    { ...template, ...updated, id: Date.now(), startMonth: key },
  ];
});

function App() {
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
      return defaultValue;
    }
  };

  const [currentMonth] = useState(() => getMonthKey(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Cada mês guarda { salary?, incomes, expenses }. Sem `salary` próprio, herda o salário do mês atual.
  const [months, setMonths] = useState(() => {
    const saved = loadFromLocalStorage('calculadora-meses', null);
    if (saved) return saved;

    // Migração: dados antigos (sem separação por mês) passam a pertencer ao mês atual
    const legacySalary = loadFromLocalStorage('calculadora-salary', '');
    return {
      [currentMonth]: {
        ...(legacySalary !== '' ? { salary: legacySalary } : {}),
        incomes: loadFromLocalStorage('calculadora-incomes', []),
        expenses: loadFromLocalStorage('calculadora-expenses', []),
      },
    };
  });
  const [recurringExpenses, setRecurringExpenses] = useState(() => loadFromLocalStorage('calculadora-recorrentes', []));
  const [caixinhas, setCaixinhas] = useState(() => loadFromLocalStorage('calculadora-caixinhas', []));

  useEffect(() => {
    localStorage.setItem('calculadora-meses', JSON.stringify(months));
    localStorage.removeItem('calculadora-salary');
    localStorage.removeItem('calculadora-incomes');
    localStorage.removeItem('calculadora-expenses');
  }, [months]);

  useEffect(() => {
    localStorage.setItem('calculadora-recorrentes', JSON.stringify(recurringExpenses));
  }, [recurringExpenses]);

  useEffect(() => {
    localStorage.setItem('calculadora-caixinhas', JSON.stringify(caixinhas));
  }, [caixinhas]);

  const salaryInfo = getSalaryInfo(months, selectedMonth);
  const salary = salaryInfo.value;
  const salaryRecurring = salaryInfo.recurring;
  const incomes = getMonthIncomes(months, selectedMonth);
  const expenses = getMonthExpenses(months, recurringExpenses, selectedMonth);

  const totalExpenses = sumValues(expenses);
  const totalIncomes = sumValues(incomes);
  const remainingBalance = parseFloat(salary || 0) + totalIncomes - totalExpenses;

  const [chartYear, setChartYear] = useState(() => Number(currentMonth.slice(0, 4)));
  const chartYears = useMemo(() => getChartYears(currentMonth), [currentMonth]);
  const evolution = useMemo(
    () => buildEvolution({ months, recurringExpenses, caixinhas, year: chartYear, currentMonth }),
    [months, recurringExpenses, caixinhas, chartYear, currentMonth]
  );

  const updateSelectedMonth = (update) => {
    setMonths((prev) => ({
      ...prev,
      [selectedMonth]: update(prev[selectedMonth] || {}),
    }));
  };

  const updateSelectedList = (listKey, update) => {
    updateSelectedMonth((month) => ({ ...month, [listKey]: update(month[listKey] || []) }));
  };

  // Salário recorrente é propagado para os meses futuros; sem recorrência, vale só para o mês
  const writeSalary = (prev, key, value, recurring) => {
    const next = {
      ...prev,
      [key]: { ...(prev[key] || {}), salary: value, salaryRecurring: recurring },
    };
    if (recurring) {
      Object.keys(prev)
        .filter((k) => k > key)
        .forEach((k) => {
          next[k] = { ...prev[k], salary: value, salaryRecurring: true };
        });
    }
    return next;
  };

  const setSalary = (value) => {
    setMonths((prev) => writeSalary(prev, selectedMonth, value, salaryRecurring));
  };

  // Marcar propaga o valor e a flag para os meses futuros; desmarcar vale só para o mês atual
  const setSalaryRecurring = (flag) => {
    setMonths((prev) => writeSalary(prev, selectedMonth, getSalaryInfo(prev, selectedMonth).value, flag));
  };

  const isRecurringId = (id) => String(id).startsWith('rec-');
  const recurringTemplateId = (id) => Number(String(id).slice(4));

  const addExpense = ({ recurring, ...expense }) => {
    if (recurring) {
      setRecurringExpenses((prev) => [...prev, { ...expense, id: Date.now(), startMonth: selectedMonth }]);
      return;
    }
    updateSelectedList('expenses', (list) => [...list, { ...expense, id: Date.now() }]);
  };

  const removeExpense = (id) => {
    if (isRecurringId(id)) {
      const templateId = recurringTemplateId(id);
      setRecurringExpenses((prev) => stopRecurring(prev, selectedMonth, templateId));
      return;
    }
    updateSelectedList('expenses', (list) => list.filter(expense => expense.id !== id));
  };

  const editExpense = (id, updatedExpense) => {
    if (isRecurringId(id)) {
      const templateId = recurringTemplateId(id);
      setRecurringExpenses((prev) => editRecurring(prev, selectedMonth, templateId, updatedExpense));
      return;
    }
    updateSelectedList('expenses', (list) => list.map(expense =>
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ));
  };

  const addIncome = (income) => {
    updateSelectedList('incomes', (list) => [...list, { ...income, id: Date.now() }]);
  };

  const removeIncome = (id) => {
    updateSelectedList('incomes', (list) => list.filter(income => income.id !== id));
  };

  const editIncome = (id, updatedIncome) => {
    updateSelectedList('incomes', (list) => list.map(income =>
      income.id === id ? { ...income, ...updatedIncome } : income
    ));
  };

  const clearAll = () => {
    updateSelectedMonth(() => ({ salary: '', incomes: [], expenses: [] }));
    setRecurringExpenses((prev) => stopRecurring(prev, selectedMonth));
  };

  const goToPreviousMonth = () => setSelectedMonth((key) => shiftMonthKey(key, -1));
  const goToNextMonth = () => setSelectedMonth((key) => shiftMonthKey(key, 1));

  // Caixinhas
  const addCaixinha = (caixinha) => {
    setCaixinhas((prev) => [...prev, registrarValorCaixinha({ ...caixinha, id: Date.now() }, caixinha.valorAtual)]);
  };

  const removeCaixinha = (id) => {
    setCaixinhas((prev) => prev.filter((c) => c.id !== id));
  };

  const editCaixinha = (id, updated) => {
    setCaixinhas((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const mudouValor = updated.valorAtual !== undefined && updated.valorAtual !== c.valorAtual;
      return mudouValor
        ? { ...registrarValorCaixinha(c, updated.valorAtual), ...updated }
        : { ...c, ...updated };
    }));
  };

  const updateCaixinhaValor = (id, novoValor) => {
    setCaixinhas((prev) => prev.map((c) => (c.id === id ? registrarValorCaixinha(c, novoValor) : c)));
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <MonthNavigator
          label={formatMonthLabel(selectedMonth)}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
        />
        <div className="calculator-container">
          <FinanceCalculator
            key={selectedMonth}
            salary={salary}
            setSalary={setSalary}
            salaryRecurring={salaryRecurring}
            setSalaryRecurring={setSalaryRecurring}
            expenses={expenses}
            addExpense={addExpense}
            removeExpense={removeExpense}
            editExpense={editExpense}
            incomes={incomes}
            addIncome={addIncome}
            removeIncome={removeIncome}
            editIncome={editIncome}
            clearAll={clearAll}
          />
          <Summary
            salary={parseFloat(salary || 0)}
            totalIncomes={totalIncomes}
            totalExpenses={totalExpenses}
            remainingBalance={remainingBalance}
          />
        </div>
        <div className="caixinhas-container">
          <Caixinhas
            caixinhas={caixinhas}
            addCaixinha={addCaixinha}
            removeCaixinha={removeCaixinha}
            editCaixinha={editCaixinha}
            updateCaixinhaValor={updateCaixinhaValor}
          />
        </div>
        <div className="charts-container">
          <Charts
            evolution={evolution}
            year={chartYear}
            years={chartYears}
            onYearChange={setChartYear}
          />
        </div>
      </main>
    </div>
  );
}

export default App
