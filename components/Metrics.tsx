'use client';

import React from 'react';
import EditableText from './admin/EditableText';

export default function Metrics() {
  return (
    <div className="metrics">
      <div className="container metrics-grid">
        <div className="metric">
          <EditableText
            page="home"
            section="metrics"
            fieldKey="m1_val"
            defaultContent="+25 Anos"
            as="strong"
          />
          <EditableText
            page="home"
            section="metrics"
            fieldKey="m1_label"
            defaultContent="Tradição & Liderança Jurídica"
            as="small"
          />
        </div>

        <div className="metric">
          <EditableText
            page="home"
            section="metrics"
            fieldKey="m2_val"
            defaultContent="+5.000"
            as="strong"
          />
          <EditableText
            page="home"
            section="metrics"
            fieldKey="m2_label"
            defaultContent="Demandas & Casos Estratégicos"
            as="small"
          />
        </div>

        <div className="metric">
          <EditableText
            page="home"
            section="metrics"
            fieldKey="m3_val"
            defaultContent="Band News & CNN"
            as="strong"
          />
          <EditableText
            page="home"
            section="metrics"
            fieldKey="m3_label"
            defaultContent="Presença na Grande Mídia"
            as="small"
          />
        </div>

        <div className="metric">
          <EditableText
            page="home"
            section="metrics"
            fieldKey="m4_val"
            defaultContent="Prêmio Quality"
            as="strong"
          />
          <EditableText
            page="home"
            section="metrics"
            fieldKey="m4_label"
            defaultContent="Excelência & Ética na Justiça"
            as="small"
          />
        </div>
      </div>
    </div>
  );
}
