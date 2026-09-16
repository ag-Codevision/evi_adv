import React from 'react';

export default function Metrics() {
  return (
    <div className="metrics">
      <div className="container metrics-grid">
        <div className="metric motion-item" data-motion="left">
          <strong>+25 Anos</strong>
          <small>Tradição & Liderança Jurídica</small>
        </div>
        <div className="metric motion-item" data-motion="up">
          <strong>+3.500</strong>
          <small>Demandas & Casos Estratégicos</small>
        </div>
        <div className="metric motion-item" data-motion="up">
          <strong>Band News & TV</strong>
          <small>Presença na Grande Mídia</small>
        </div>
        <div className="metric motion-item" data-motion="right">
          <strong>Prêmio Quality</strong>
          <small>Excelência & Ética na Justiça</small>
        </div>
      </div>
    </div>
  );
}
