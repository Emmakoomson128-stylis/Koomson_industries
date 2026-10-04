
    // WhatsApp requires an international number. This uses Ghana's country code for the supplied 055 number.
    const WHATSAPP_NUMBER = '233558214797';
    const dialog = document.getElementById('quote-dialog');
    const form = document.getElementById('quote-form');
    const materialSelect = document.getElementById('material');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');

    function setMobileMenu(open) {
      mobileMenu.classList.toggle('hidden', !open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      menuIcon.innerHTML = open
        ? '<path d="m6 6 12 12M18 6 6 18"/>'
        : '<path d="M4 7h16M4 12h16M4 17h16"/>';
    }

    function openQuote(material = '') {
      if (material) materialSelect.value = material;
      if (!dialog.open) dialog.showModal();
      setTimeout(() => (material ? document.getElementById('quantity') : materialSelect).focus(), 40);
      setMobileMenu(false);
    }

    document.querySelectorAll('[data-open-quote]').forEach((button) => button.addEventListener('click', () => openQuote()));
    document.querySelectorAll('[data-order]').forEach((button) => button.addEventListener('click', () => openQuote(button.dataset.order)));
    document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && dialog.open) dialog.close(); });

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMobileMenu(!isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));

    document.querySelectorAll('.filter-chip').forEach((chip) => chip.addEventListener('click', () => {
      const category = chip.dataset.filter;
      document.querySelectorAll('.filter-chip').forEach((item) => {
        const active = item === chip;
        item.setAttribute('aria-pressed', String(active));
        item.classList.toggle('bg-ink', active);
        item.classList.toggle('text-white', active);
        item.classList.toggle('border', !active);
        item.classList.toggle('border-line', !active);
        item.classList.toggle('bg-white', !active);
        item.classList.toggle('text-slatewarm', !active);
      });
      let visibleCount = 0;
      document.querySelectorAll('.product-card').forEach((card) => {
        const visible = category === 'all' || card.dataset.category === category;
        card.classList.toggle('hidden', !visible);
        if (visible) visibleCount++;
      });
      document.getElementById('empty-products').classList.toggle('hidden', visibleCount > 0);
    }));

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const message = [
        'Hello, I would like to ask for prices for building materials.',
        '',
        `Material: ${data.get('material')}`,
        `Estimated quantity: ${data.get('quantity')} ${data.get('unit')}`,
        `Delivery location: ${data.get('location').trim()}`,
        `Name: ${data.get('customer-name').trim()}`,
        data.get('customer-phone') ? `Phone: ${data.get('customer-phone').trim()}` : '',
        data.get('notes') ? `Additional details: ${data.get('notes').trim()}` : ''
      ].filter(Boolean).join('\n');
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      dialog.close();
    });
  
