import React, { useState } from 'react';
import './Caixinhas.css';

const Caixinhas = ({ caixinhas, addCaixinha, removeCaixinha, editCaixinha, updateCaixinhaValor }) => {
  const emptyForm = {
    nome: '',
    valorAtual: '',
    meta: '',
    poupancaMensal: '',
    dataObjetivo: '',
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [depositValues, setDepositValues] = useState({});

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  const calcProgress = (atual, meta) => {
    if (!meta || meta <= 0) return 0;
    return Math.min((atual / meta) * 100, 100);
  };

  const calcPrevisao = (caixinha) => {
    const falta = (caixinha.meta || 0) - (caixinha.valorAtual || 0);
    if (falta <= 0) return null;
    if (!caixinha.poupancaMensal || caixinha.poupancaMensal <= 0) return null;
    const meses = Math.ceil(falta / caixinha.poupancaMensal);
    const dataPrevisao = new Date();
    dataPrevisao.setMonth(dataPrevisao.getMonth() + meses);
    return { meses, data: dataPrevisao };
  };

  const formatDate = (date) =>
    new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);

  const getProgressColor = (pct) => {
    if (pct >= 100) return '#059669';
    if (pct >= 70) return '#0ea5e9';
    if (pct >= 40) return '#d4af37';
    return '#f97316';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.meta) return;
    addCaixinha({
      nome: form.nome,
      valorAtual: parseFloat(form.valorAtual) || 0,
      meta: parseFloat(form.meta),
      poupancaMensal: parseFloat(form.poupancaMensal) || 0,
      dataObjetivo: form.dataObjetivo || null,
    });
    setForm(emptyForm);
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditForm({
      nome: c.nome,
      valorAtual: c.valorAtual.toString(),
      meta: c.meta.toString(),
      poupancaMensal: c.poupancaMensal.toString(),
      dataObjetivo: c.dataObjetivo || '',
    });
  };

  const saveEdit = () => {
    editCaixinha(editingId, {
      nome: editForm.nome,
      valorAtual: parseFloat(editForm.valorAtual) || 0,
      meta: parseFloat(editForm.meta),
      poupancaMensal: parseFloat(editForm.poupancaMensal) || 0,
      dataObjetivo: editForm.dataObjetivo || null,
    });
    setEditingId(null);
  };

  const handleDeposit = (id) => {
    const valor = parseFloat(depositValues[id]);
    if (!valor || valor <= 0) return;
    const caixinha = caixinhas.find((c) => c.id === id);
    if (!caixinha) return;
    updateCaixinhaValor(id, caixinha.valorAtual + valor);
    setDepositValues((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="caixinhas-wrapper">
      <div className="caixinhas-header">
        <div className="caixinhas-header-icon">🏦</div>
        <div>
          <h2>Caixinhas de Objetivos</h2>
          <p>Crie reservas financeiras com metas e acompanhe seu progresso</p>
        </div>
      </div>

      {/* Formulário de criação */}
      <form className="caixinha-form" onSubmit={handleSubmit}>
        <h3>Nova Caixinha</h3>
        <div className="caixinha-form-grid">
          <div className="form-group">
            <label>Nome da Caixinha</label>
            <input
              type="text"
              placeholder="Ex: Viagem, Carro, Emergência…"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Meta (R$)</label>
            <div className="input-currency">
              <span>R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.meta}
                onChange={(e) => setForm({ ...form, meta: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Valor Já Guardado (R$)</label>
            <div className="input-currency">
              <span>R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.valorAtual}
                onChange={(e) => setForm({ ...form, valorAtual: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Guardar por Mês (R$)</label>
            <div className="input-currency">
              <span>R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.poupancaMensal}
                onChange={(e) => setForm({ ...form, poupancaMensal: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Data Objetivo (opcional)</label>
            <input
              type="date"
              value={form.dataObjetivo}
              onChange={(e) => setForm({ ...form, dataObjetivo: e.target.value })}
            />
          </div>

          <div className="form-group btn-group-caixinha">
            <button type="submit" className="btn-caixinha-add">
              ＋ Criar Caixinha
            </button>
          </div>
        </div>
      </form>

      {/* Lista de caixinhas */}
      {caixinhas.length > 0 && (
        <div className="caixinhas-list">
          {caixinhas.map((c) => {
            const pct = calcProgress(c.valorAtual, c.meta);
            const falta = Math.max((c.meta || 0) - (c.valorAtual || 0), 0);
            const previsao = calcPrevisao(c);
            const cor = getProgressColor(pct);
            const concluida = pct >= 100;

            return (
              <div key={c.id} className={`caixinha-card ${concluida ? 'concluida' : ''}`}>
                {editingId === c.id ? (
                  /* Modo edição */
                  <div className="caixinha-edit">
                    <h3>Editando: {c.nome}</h3>
                    <div className="caixinha-form-grid">
                      <div className="form-group">
                        <label>Nome</label>
                        <input
                          type="text"
                          value={editForm.nome}
                          onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Meta (R$)</label>
                        <div className="input-currency">
                          <span>R$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.meta}
                            onChange={(e) => setEditForm({ ...editForm, meta: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Valor Guardado (R$)</label>
                        <div className="input-currency">
                          <span>R$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.valorAtual}
                            onChange={(e) => setEditForm({ ...editForm, valorAtual: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Guardar por Mês (R$)</label>
                        <div className="input-currency">
                          <span>R$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.poupancaMensal}
                            onChange={(e) => setEditForm({ ...editForm, poupancaMensal: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Data Objetivo</label>
                        <input
                          type="date"
                          value={editForm.dataObjetivo}
                          onChange={(e) => setEditForm({ ...editForm, dataObjetivo: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="btn-save-edit">✓ Salvar</button>
                      <button onClick={() => setEditingId(null)} className="btn-cancel-edit">✕ Cancelar</button>
                    </div>
                  </div>
                ) : (
                  /* Modo visualização */
                  <>
                    <div className="caixinha-top">
                      <div className="caixinha-title-area">
                        <div className="caixinha-emoji">{concluida ? '🎉' : '🎯'}</div>
                        <div>
                          <h3 className="caixinha-nome">{c.nome}</h3>
                          {concluida && <span className="badge-concluida">Meta atingida!</span>}
                        </div>
                      </div>
                      <div className="caixinha-actions-top">
                        <button onClick={() => startEdit(c)} className="btn-icon" title="Editar">✏️</button>
                        <button onClick={() => removeCaixinha(c.id)} className="btn-icon btn-remove-caixinha" title="Remover">×</button>
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="progress-section">
                      <div className="progress-info">
                        <span className="progress-pct" style={{ color: cor }}>{pct.toFixed(1)}%</span>
                        <span className="progress-valores">
                          {formatCurrency(c.valorAtual)} <span className="progress-sep">de</span> {formatCurrency(c.meta)}
                        </span>
                      </div>
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${pct}%`, backgroundColor: cor }}
                        />
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="caixinha-stats">
                      <div className="stat-item">
                        <span className="stat-label">Falta</span>
                        <span className="stat-value falta">{falta > 0 ? formatCurrency(falta) : '—'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Por mês</span>
                        <span className="stat-value">{c.poupancaMensal > 0 ? formatCurrency(c.poupancaMensal) : '—'}</span>
                      </div>
                      {previsao && (
                        <div className="stat-item">
                          <span className="stat-label">Previsão</span>
                          <span className="stat-value previsao">
                            {formatDate(previsao.data)}
                            <small>({previsao.meses} {previsao.meses === 1 ? 'mês' : 'meses'})</small>
                          </span>
                        </div>
                      )}
                      {c.dataObjetivo && (
                        <div className="stat-item">
                          <span className="stat-label">Data objetivo</span>
                          <span className="stat-value">
                            {new Intl.DateTimeFormat('pt-BR').format(new Date(c.dataObjetivo + 'T00:00:00'))}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Depósito rápido */}
                    {!concluida && (
                      <div className="deposito-rapido">
                        <label>Adicionar valor guardado:</label>
                        <div className="deposito-row">
                          <div className="input-currency deposito-input">
                            <span>R$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0,00"
                              value={depositValues[c.id] || ''}
                              onChange={(e) =>
                                setDepositValues((prev) => ({ ...prev, [c.id]: e.target.value }))
                              }
                            />
                          </div>
                          <button
                            className="btn-depositar"
                            onClick={() => handleDeposit(c.id)}
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {caixinhas.length === 0 && (
        <div className="caixinhas-empty">
          <div className="empty-icon">🏦</div>
          <p>Nenhuma caixinha criada ainda.</p>
          <small>Crie sua primeira reserva financeira acima!</small>
        </div>
      )}
    </div>
  );
};

export default Caixinhas;
