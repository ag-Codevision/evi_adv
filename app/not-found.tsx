import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-6xl font-serif font-bold text-evi-deep mb-4">404</h1>
      <h2 className="text-2xl font-serif font-semibold text-evi-dark mb-4">Página Não Encontrada</h2>
      <p className="text-evi-muted max-w-md mb-8">
        O conteúdo que você tentou acessar não existe ou foi movido para um novo endereço.
      </p>
      <Link
        href="/"
        className="btn btn-navy px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-lg"
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}
