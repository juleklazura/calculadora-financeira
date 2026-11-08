import React from 'react';
import './Charts.css';
import { formatMonthLabel } from '../utils/finance';

const PALETTE = ['#d4af37', '#1e293b', '#059669', '#0ea5e9', '#f97316', '#8b5cf6', '#e11d48'];

const WIDTH = 720;
const HEIGHT = 280;
const PAD = { top: 16, right: 16, bottom: 36, left: 72 };

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const formatAxis = (value) => {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`;
  }
  return Math.round(value).toString();
};

// Arredonda para cima num valor "redondo" (1, 2, 2.5, 5 ou 10 vezes uma potência de 10)
const niceCeil = (value) => {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= value);
  return step * magnitude;
};

const SeriesChart = ({ labels, series }) => {
  const values = series.flatMap((s) => s.values).filter((v) => v !== null);
  const top = niceCeil(Math.max(0, ...values));
  const bottom = Math.min(0, ...values) < 0 ? -niceCeil(-Math.min(...values)) : 0;

  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const yOf = (v) => PAD.top + innerH * (1 - (v - bottom) / (top - bottom));
  const band = innerW / labels.length;
  const xOf = (i) => PAD.left + band * (i + 0.5);

  const ticks = [0, 1, 2, 3, 4].map((i) => bottom + ((top - bottom) * i) / 4);
  const bars = series.filter((s) => s.type === 'bar');
  const lines = series.filter((s) => s.type === 'line');
  const barWidth = (band * 0.6) / Math.max(bars.length, 1);

  const linePath = (values) =>
    values.reduce((d, v, i) => {
      if (v === null) return d;
      const cmd = d === '' || values[i - 1] === null ? 'M' : 'L';
      return `${d}${cmd}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)} `;
    }, '');

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="chart-svg" role="img">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yOf(t)} y2={yOf(t)} className="chart-grid" />
          <text x={PAD.left - 8} y={yOf(t) + 4} textAnchor="end" className="chart-axis">
            {formatAxis(t)}
          </text>
        </g>
      ))}

      {bars.map((s, si) =>
        s.values.map((v, i) => {
          if (v === null) return null;
          const x = xOf(i) - (barWidth * bars.length) / 2 + si * barWidth;
          const y = Math.min(yOf(v), yOf(0));
          const h = Math.abs(yOf(v) - yOf(0));
          return (
            <rect key={`${s.name}-${i}`} x={x} y={y} width={barWidth * 0.9} height={h} fill={s.color} rx="3">
              <title>{`${labels[i]} · ${s.name}: ${formatCurrency(v)}`}</title>
            </rect>
          );
        })
      )}

      {lines.map((s) => (
        <g key={s.name}>
          <path
            d={linePath(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeDasharray={s.dashed ? '6 6' : undefined}
          />
          {!s.dashed && s.values.map((v, i) =>
            v === null ? null : (
              <circle key={i} cx={xOf(i)} cy={yOf(v)} r="4" fill={s.color}>
                <title>{`${labels[i]} · ${s.name}: ${formatCurrency(v)}`}</title>
              </circle>
            )
          )}
        </g>
      ))}

      {labels.map((label, i) => (
        <text key={`${label}-${i}`} x={xOf(i)} y={HEIGHT - 12} textAnchor="middle" className="chart-axis">
          {label}
        </text>
      ))}
    </svg>
  );
};

const ChartCard = ({ title, description, labels, series, className = '', emptyText, footer }) => (
  <section className={`chart-card ${className}`}>
    <h3>{title}</h3>
    <p className="chart-description">{description}</p>
    {series.length > 0 ? (
      <>
        <div className="chart-legend">
          {series.map((s) => (
            <span key={s.name}>
              <i style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
        <SeriesChart labels={labels} series={series} />
        {footer}
      </>
    ) : (
      <p className="chart-empty">{emptyText}</p>
    )}
  </section>
);

const Charts = ({ evolution, year, years, onYearChange }) => {
  const { labels, salario, rendaTotal, gastos, saldo, caixinhas } = evolution;

  const caixinhaSeries = caixinhas.flatMap((c, i) => {
    const color = PALETTE[i % PALETTE.length];
    const real = { name: c.nome, type: 'line', color, values: c.values };
    if (c.dataAlcance === null || c.projecao.every((v) => v === null)) return [real];
    return [real, { name: `${c.nome} (previsão)`, type: 'line', color, dashed: true, values: c.projecao }];
  });

  const previsoes = caixinhas.map((c) => {
    let texto;
    if (c.concluida) texto = `Meta atingida em ${formatMonthLabel(c.dataAlcance)}`;
    else if (c.dataAlcance) {
      texto = `Aportes médios de ${formatCurrency(c.taxa)}/mês · meta prevista para ${formatMonthLabel(c.dataAlcance)}`;
    } else texto = 'Sem aportes recentes: não há previsão para a meta';
    return { id: c.id, nome: c.nome, texto };
  });

  return (
    <div className="charts-wrapper">
      <div className="charts-header">
        <div className="charts-header-icon">📈</div>
        <div className="charts-header-text">
          <h2>Evolução Financeira</h2>
          <p>Acompanhe salário, gastos e caixinhas mês a mês</p>
        </div>
        <label className="charts-year-select">
          Ano
          <select value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="charts-grid">
        <ChartCard
          title="Salário e renda"
          description="Salário mensal e renda total (salário + rendas extras)"
          labels={labels}
          series={[
            { name: 'Salário', type: 'line', color: '#d4af37', values: salario },
            { name: 'Renda total', type: 'line', color: '#1e293b', values: rendaTotal },
          ]}
        />
        <ChartCard
          title="Gastos e saldo"
          description="Total de gastos (barras) e saldo restante (linha) por mês"
          labels={labels}
          series={[
            { name: 'Gastos', type: 'bar', color: '#dc2626', values: gastos },
            { name: 'Saldo restante', type: 'line', color: '#059669', values: saldo },
          ]}
        />
        <ChartCard
          className="wide"
          title="Caixinhas"
          description="Valor guardado em cada caixinha ao fim de cada mês, com previsão tracejada até a meta, baseada nos aportes médios"
          labels={labels}
          series={caixinhaSeries}
          emptyText="Crie uma caixinha para acompanhar sua evolução aqui."
          footer={
            previsoes.length > 0 && (
              <ul className="chart-previsoes">
                {previsoes.map((p) => (
                  <li key={p.id}>
                    <strong>{p.nome}:</strong> {p.texto}
                  </li>
                ))}
              </ul>
            )
          }
        />
      </div>
    </div>
  );
};


export default Charts;
