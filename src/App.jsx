import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FinanceCalculator from './components/FinanceCalculator';
import Summary from './components/Summary';

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

  const [salary, setSalary] = useState(() => loadFromLocalStorage('calculadora-salary', ''));
  const [incomes, setIncomes] = useState(() => loadFromLocalStorage('calculadora-incomes', []));
  const [expenses, setExpenses] = useState(() => loadFromLocalStorage('calculadora-expenses', []));
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  useEffect(() => {
    localStorage.setItem('calculadora-salary', JSON.stringify(salary));
  }, [salary]);

  useEffect(() => {
    localStorage.setItem('calculadora-incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('calculadora-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    const totalExp = expenses.reduce((sum, expense) => sum + parseFloat(expense.value || 0), 0);
    const totalInc = incomes.reduce((sum, income) => sum + parseFloat(income.value || 0), 0);
    const salaryValue = parseFloat(salary || 0);
    
    setTotalExpenses(totalExp);
    setTotalIncomes(totalInc);
    setRemainingBalance(salaryValue + totalInc - totalExp);
  }, [salary, expenses, incomes]);

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const editExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ));
  };

  const addIncome = (income) => {
    setIncomes([...incomes, { ...income, id: Date.now() }]);
  };

  const removeIncome = (id) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  const editIncome = (id, updatedIncome) => {
    setIncomes(incomes.map(income => 
      income.id === id ? { ...income, ...updatedIncome } : income
    ));
  };

  const clearAll = () => {
    setSalary('');
    setExpenses([]);
    setIncomes([]);
    localStorage.removeItem('calculadora-salary');
    localStorage.removeItem('calculadora-expenses');
    localStorage.removeItem('calculadora-incomes');
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="calculator-container">
          <FinanceCalculator
            salary={salary}
            setSalary={setSalary}
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
      </main>
    </div>
  );
}

export default App
