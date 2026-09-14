import React from 'react';

export default function Metrics() {
  return (
    <div className="metrics">
      <div className="container metrics-grid">
        <div className="metric motion-item" data-motion="left">
          <strong>5,0 ★</strong>
          <small>avaliação no Google</small>
        </div>
        <div className="metric motion-item" data-motion="up">
          <strong>100+</strong>
          <small>avaliações públicas</small>
        </div>
        <div className="metric motion-item" data-motion="up">
          <strong>5 áreas</strong>
          <small>de atuação jurídica</small>
        </div>
        <div className="metric motion-item" data-motion="right">
          <strong>Brasil</strong>
          <small>alcance nacional</small>
        </div>
      </div>
    </div>
  );
}
