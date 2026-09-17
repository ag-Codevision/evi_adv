import React from 'react';

export default function ContactSection() {
  return (
    <section className="contact" id="contato">
      <div className="container contact-panel">
        <div className="contact-copy motion-item" data-motion="left">
          <span className="eyebrow">Contato</span>
          <h2>Converse com o escritório.</h2>
          <p>
            Apresente sua necessidade pelos canais oficiais e receba orientação sobre o atendimento.
          </p>
          <div className="contact-list">
            <a href="tel:+551143623533">Telefone · (11) 4362-3533</a>
            <a href="mailto:contato@evi.adv.br">contato@evi.adv.br</a>
            <span>Atendimento em todo o território nacional</span>
          </div>
          <a
            className="btn btn-wa"
            href="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20encontrei%20o%20site%20e%20gostaria%20de%20receber%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="wa-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.591-6.592 6.591zm3.615-4.934c-.197-.1-1.17-.578-1.353-.643-.182-.064-.315-.096-.445.1-.133.197-.514.643-.63.775-.116.133-.232.15-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.17-1.101-1.37-.116-.197-.013-.304.087-.403.09-.089.197-.232.296-.348.1-.116.133-.197.197-.33.064-.133.033-.25-.017-.348-.05-.1-.445-1.075-.61-1.47-.16-.389-.326-.336-.445-.343-.116-.007-.25-.007-.38-.007a.729.729 0 0 0-.527.245c-.182.197-.691.676-.691 1.648s.708 1.912.807 2.045c.1.133 1.394 2.13 3.38 2.99.473.204.84.326 1.129.416.473.15.904.129 1.244.078.38-.058 1.17-.48 1.337-.943.164-.464.164-.86.116-.943-.05-.084-.182-.133-.38-.232z"
              />
            </svg>
            <span>Iniciar conversa</span>
          </a>
        </div>
        <iframe
          className="motion-item"
          data-motion="right"
          title="Mapa de EVI Sociedade de Advogados"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.241512497698!2d-46.6083219!3d-23.5955075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59b8983035d9%3A0x344dfa9c9341de93!2sEVI%20Sociedade%20de%20Advogados!5e0!3m2!1spt-BR!2sbr!4v1710500000000!5m2!1spt-BR!2sbr"
        />
      </div>
    </section>
  );
}
