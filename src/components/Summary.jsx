import React from 'react';
import './Summary.css';

const Summary = ({ salary, totalIncomes, totalExpenses, remainingBalance }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBalanceStatus = () => {
    if (remainingBalance > 0) return 'positive';
    if (remainingBalance < 0) return 'negative';
    return 'neutral';
  };

  const getTotalIncome = () => {
    return salary + totalIncomes;
  };

  const getSavingsPercentage = () => {
    const totalIncome = getTotalIncome();
    if (totalIncome > 0) {
      return ((remainingBalance / totalIncome) * 100).toFixed(1);
    }
    return 0;
  };

  const getExpensePercentage = () => {
    const totalIncome = getTotalIncome();
    if (totalIncome > 0) {
      return ((totalExpenses / totalIncome) * 100).toFixed(1);
    }
    return 0;
  };

  return (
    <div className="summary">
      <div className="summary-header">
        <h2>Resumo Financeiro</h2>
      </div>

      <div className="summary-cards">
        <div className="summary-card salary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Salário Mensal</h3>
            <div className="card-value">{formatCurrency(salary)}</div>
          </div>
        </div>

        {totalIncomes > 0 && (
          <div className="summary-card income-card">
            <div className="card-icon">💎</div>
            <div className="card-content">
              <h3>Rendas Extras</h3>
              <div className="card-value">{formatCurrency(totalIncomes)}</div>
            </div>
          </div>
        )}

        <div className="summary-card total-income-card">
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <h3>Renda Total</h3>
            <div className="card-value">{formatCurrency(getTotalIncome())}</div>
          </div>
        </div>

        <div className="summary-card expenses-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Total de Gastos</h3>
            <div className="card-value">{formatCurrency(totalExpenses)}</div>
            <div className="card-percentage">{getExpensePercentage()}% da renda</div>
          </div>
        </div>

        <div className={`summary-card balance-card ${getBalanceStatus()}`}>
          <div className="card-icon">
            {remainingBalance >= 0 ? '✅' : '⚠️'}
          </div>
          <div className="card-content">
            <h3>Saldo Restante</h3>
            <div className="card-value">{formatCurrency(remainingBalance)}</div>
            <div className="card-percentage">
              {remainingBalance >= 0 ? `${getSavingsPercentage()}% poupança` : 'Déficit'}
            </div>
          </div>
        </div>
      </div>

      {getTotalIncome() > 0 && (
        <div className="financial-advice">
          <h3>Análise Financeira</h3>
          <div className="advice-content">
            {remainingBalance > getTotalIncome() * 0.2 ? (
              <div className="advice excellent">
                <span className="advice-icon">🎉</span>
                <p>Excelente! Você está poupando mais de 20% da sua renda total.</p>
              </div>
            ) : remainingBalance > getTotalIncome() * 0.1 ? (
              <div className="advice good">
                <span className="advice-icon">👍</span>
                <p>Muito bom! Você está mantendo uma reserva saudável.</p>
              </div>
            ) : remainingBalance >= 0 ? (
              <div className="advice warning">
                <span className="advice-icon">⚡</span>
                <p>Atenção! Tente aumentar sua poupança para pelo menos 10% da renda.</p>
              </div>
            ) : (
              <div className="advice danger">
                <span className="advice-icon">🚨</span>
                <p>Cuidado! Seus gastos estão excedendo sua renda. Revise seu orçamento.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="progress-bar-container">
        <div className="progress-label">
          <span>Gastos vs Renda Total</span>
          <span>{getExpensePercentage()}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min(getExpensePercentage(), 100)}%`,
              backgroundColor: getExpensePercentage() > 80 ? '#e74c3c' : 
                             getExpensePercentage() > 60 ? '#f39c12' : '#27ae60'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
