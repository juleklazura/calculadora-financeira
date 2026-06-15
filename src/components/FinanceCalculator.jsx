import React, { useState } from 'react';
import './FinanceCalculator.css';

const FinanceCalculator = ({ 
  salary, 
  setSalary, 
  expenses, 
  addExpense, 
  removeExpense,
  editExpense,
  incomes,
  addIncome,
  removeIncome,
  editIncome,
  clearAll 
}) => {
  const [expenseName, setExpenseName] = useState('');
  const [expenseValue, setExpenseValue] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Acessórios Tech');
  
  const [incomeName, setIncomeName] = useState('');
  const [incomeValue, setIncomeValue] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('13º Salário');
  
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  const categories = [
    'Acessórios Tech',
    'Academia e Esportes',
    'Água e Saneamento',
    'Aluguel / Financiamento',
    'Assinaturas de Software',
    'Babá / Cuidador',
    'Bebidas',
    'Brinquedos e Atividades Infantis',
    'Cartão de Crédito',
    'Cinema, Teatro e Shows',
    'Combustível',
    'Condomínio',
    'Consultas e Exames',
    'Cosméticos e Perfumaria',
    'Cursos e Capacitação',
    'Dentista',
    'Eletrônicos e Gadgets',
    'Emergências',
    'Energia Elétrica',
    'Escola dos Filhos',
    'Estacionamento e Pedágio',
    'Farmácia e Medicamentos',
    'Feira e Hortifruti',
    'Financiamento / Empréstimo',
    'Gás',
    'Hobbies',
    'Idiomas',
    'Impostos e Taxas',
    'Internet e TV',
    'Investimentos',
    'IPTU',
    'IPVA e Seguro Auto',
    'Jogos',
    'Livros e Material Escolar',
    'Manutenção do Veículo',
    'Manutenção e Reforma',
    'Mensalidade Escolar / Faculdade',
    'Outros',
    'Padaria e Confeitaria',
    'Pet Shop e Banho',
    'Plano de Saúde',
    'Presentes e Doações',
    'Psicólogo / Terapia',
    'Ração e Petiscos',
    'Restaurante e Delivery',
    'Roupas e Calçados',
    'Salão de Beleza e Barbearia',
    'Seguros',
    'Streaming (Netflix, Spotify…)',
    'Supermercado',
    'Telefone',
    'Transporte por App (Uber/99)',
    'Transporte Público',
    'Veterinário',
    'Viagens e Hospedagem',
  ];

  const incomeCategories = [
    '13º Salário',
    'Aluguel de Imóvel',
    'Aposentadoria / Pensão',
    'Bônus e PLR',
    'Cashback',
    'Comissões',
    'Consultoria',
    'Dividendos',
    'Férias',
    'Freelance / Projeto',
    'Herança / Doação Recebida',
    'Horas Extras',
    'Juros e CDB / Tesouro',
    'Marketing de Afiliados',
    'Monetização Online (YouTube, etc.)',
    'Outros',
    'Prestação de Serviços',
    'Prêmios e Sorteios',
    'Reembolso',
    'Renda de Conteúdo',
    'Rendimento de Investimentos',
    'Salário',
    'Trabalho Extra / Bico',
    'Vendas de Produtos',
    'Vendas Online (Shopee, etc.)',
  ];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (expenseName && expenseValue) {
      addExpense({
        name: expenseName,
        value: parseFloat(expenseValue),
        category: expenseCategory
      });
      setExpenseName('');
      setExpenseValue('');
      setExpenseCategory('Acessórios Tech');
    }
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (incomeName && incomeValue) {
      addIncome({
        name: incomeName,
        value: parseFloat(incomeValue),
        category: incomeCategory
      });
      setIncomeName('');
      setIncomeValue('');
      setIncomeCategory('13º Salário');
    }
  };

  const startEditingExpense = (expense) => {
    setEditingExpense({
      id: expense.id,
      name: expense.name,
      value: expense.value.toString(),
      category: expense.category
    });
  };

  const saveExpenseEdit = () => {
    if (editingExpense && editingExpense.name && editingExpense.value) {
      editExpense(editingExpense.id, {
        name: editingExpense.name,
        value: parseFloat(editingExpense.value),
        category: editingExpense.category
      });
      setEditingExpense(null);
    }
  };

  const cancelExpenseEdit = () => {
    setEditingExpense(null);
  };

  const startEditingIncome = (income) => {
    setEditingIncome({
      id: income.id,
      name: income.name,
      value: income.value.toString(),
      category: income.category
    });
  };

  const saveIncomeEdit = () => {
    if (editingIncome && editingIncome.name && editingIncome.value) {
      editIncome(editingIncome.id, {
        name: editingIncome.name,
        value: parseFloat(editingIncome.value),
        category: editingIncome.category
      });
      setEditingIncome(null);
    }
  };

  const cancelIncomeEdit = () => {
    setEditingIncome(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="finance-calculator">
      <div className="calculator-section">
        <div className="section-header">
          <h2>Informações Financeiras</h2>
        </div>
        
        <div className="salary-section">
          <label htmlFor="salary">Salário Mensal</label>
          <div className="input-group">
            <span className="currency-symbol">R$</span>
            <input
              id="salary"
              type="number"
              step="0.01"
              min="0"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="0,00"
              className="salary-input"
            />
          </div>
        </div>

        <form onSubmit={handleAddIncome} className="income-form">
          <h3>Adicionar Renda Extra</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="income-name">Descrição</label>
              <input
                id="income-name"
                type="text"
                value={incomeName}
                onChange={(e) => setIncomeName(e.target.value)}
                placeholder="Ex: Freelance, Dividendos, Cashback"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="income-category">Categoria</label>
              <select
                id="income-category"
                value={incomeCategory}
                onChange={(e) => setIncomeCategory(e.target.value)}
              >
                {incomeCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="income-value">Valor</label>
              <div className="input-group">
                <span className="currency-symbol">R$</span>
                <input
                  id="income-value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={incomeValue}
                  onChange={(e) => setIncomeValue(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>
            
            <div className="form-group button-group">
              <button type="submit" className="btn-add btn-income">
                Adicionar Renda
              </button>
            </div>
          </div>
        </form>

        {incomes.length > 0 && (
          <div className="incomes-list">
            <div className="incomes-header">
              <h3>Rendas Extras Registradas</h3>
            </div>
            
            <div className="incomes-table">
              {incomes.map(income => (
                <div key={income.id} className="income-item">
                  {editingIncome && editingIncome.id === income.id ? (
                    <div className="edit-form">
                      <div className="edit-inputs">
                        <input
                          type="text"
                          value={editingIncome.name}
                          onChange={(e) => setEditingIncome({...editingIncome, name: e.target.value})}
                          placeholder="Nome da renda"
                          className="edit-input"
                        />
                        <select
                          value={editingIncome.category}
                          onChange={(e) => setEditingIncome({...editingIncome, category: e.target.value})}
                          className="edit-select"
                        >
                          {incomeCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <div className="input-group edit-value-group">
                          <span className="currency-symbol">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingIncome.value}
                            onChange={(e) => setEditingIncome({...editingIncome, value: e.target.value})}
                            placeholder="0,00"
                            className="edit-input-value"
                          />
                        </div>
                      </div>
                      <div className="edit-actions">
                        <button onClick={saveIncomeEdit} className="btn-save" title="Salvar">
                          ✓
                        </button>
                        <button onClick={cancelIncomeEdit} className="btn-cancel" title="Cancelar">
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="income-info">
                        <span className="income-name">{income.name}</span>
                        <span className="income-category">{income.category}</span>
                      </div>
                      <div className="income-actions">
                        <span className="income-value">
                          {formatCurrency(income.value)}
                        </span>
                        <button
                          onClick={() => startEditingIncome(income)}
                          className="btn-edit"
                          title="Editar renda"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => removeIncome(income.id)}
                          className="btn-remove"
                          title="Remover renda"
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleAddExpense} className="expense-form">
          <h3>Adicionar Gasto</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expense-name">Descrição</label>
              <input
                id="expense-name"
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder="Ex: Conta de luz, Supermercado, Netflix"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expense-category">Categoria</label>
              <select
                id="expense-category"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expense-value">Valor</label>
              <div className="input-group">
                <span className="currency-symbol">R$</span>
                <input
                  id="expense-value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={expenseValue}
                  onChange={(e) => setExpenseValue(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>
            
            <div className="form-group button-group">
              <button type="submit" className="btn-add">
                Adicionar Gasto
              </button>
            </div>
          </div>
        </form>

        {expenses.length > 0 && (
          <div className="expenses-list">
            <div className="expenses-header">
              <h3>Gastos Registrados</h3>
              <button onClick={clearAll} className="btn-clear">
                Limpar Tudo
              </button>
            </div>
            
            <div className="expenses-table">
              {expenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  {editingExpense && editingExpense.id === expense.id ? (
                    <div className="edit-form">
                      <div className="edit-inputs">
                        <input
                          type="text"
                          value={editingExpense.name}
                          onChange={(e) => setEditingExpense({...editingExpense, name: e.target.value})}
                          placeholder="Nome do gasto"
                          className="edit-input"
                        />
                        <select
                          value={editingExpense.category}
                          onChange={(e) => setEditingExpense({...editingExpense, category: e.target.value})}
                          className="edit-select"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <div className="input-group edit-value-group">
                          <span className="currency-symbol">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingExpense.value}
                            onChange={(e) => setEditingExpense({...editingExpense, value: e.target.value})}
                            placeholder="0,00"
                            className="edit-input-value"
                          />
                        </div>
                      </div>
                      <div className="edit-actions">
                        <button onClick={saveExpenseEdit} className="btn-save" title="Salvar">
                          ✓
                        </button>
                        <button onClick={cancelExpenseEdit} className="btn-cancel" title="Cancelar">
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="expense-info">
                        <span className="expense-name">{expense.name}</span>
                        <span className="expense-category">{expense.category}</span>
                      </div>
                      <div className="expense-actions">
                        <span className="expense-value">
                          {formatCurrency(expense.value)}
                        </span>
                        <button
                          onClick={() => startEditingExpense(expense)}
                          className="btn-edit"
                          title="Editar gasto"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => removeExpense(expense.id)}
                          className="btn-remove"
                          title="Remover gasto"
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceCalculator;
