// Floating chat bubble that opens the Le Lac Jewelry Assistant (Chatling chatbot from Lab 3)
(function () {
  var BOT_URL = 'https://share.chatling.ai/s/oy8DaZ47QhK7NrE';

  var css = document.createElement('style');
  css.textContent =
    '.ll-chat-btn{position:fixed;right:22px;bottom:22px;z-index:1000;width:62px;height:62px;border-radius:50%;' +
    'border:1px solid #c9a96e;background:#0e0d0c;color:#c9a96e;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
    'box-shadow:0 8px 28px rgba(0,0,0,.5);transition:transform .2s,background .2s}' +
    '.ll-chat-btn:hover{transform:scale(1.06);background:#1a1816}' +
    '.ll-chat-btn svg{width:28px;height:28px}' +
    '.ll-chat-tip{position:fixed;right:96px;bottom:36px;z-index:1000;background:#f6f1e9;color:#0e0d0c;font:500 13px Inter,system-ui,sans-serif;' +
    'padding:8px 14px;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,.35);transition:opacity .4s}' +
    '.ll-chat-panel{position:fixed;right:22px;bottom:98px;z-index:1000;width:380px;height:560px;max-height:calc(100vh - 130px);' +
    'background:#fff;border:1px solid #c9a96e;border-radius:14px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.55);' +
    'display:none;flex-direction:column}' +
    '.ll-chat-panel.open{display:flex}' +
    '.ll-chat-head{background:#0e0d0c;color:#f6f1e9;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;' +
    'font:400 15px "Cormorant Garamond",Georgia,serif;letter-spacing:.12em;text-transform:uppercase}' +
    '.ll-chat-head button{background:none;border:0;color:#c9a96e;font-size:22px;cursor:pointer;line-height:1}' +
    '.ll-chat-panel iframe{flex:1;border:0;width:100%}' +
    '@media (max-width:480px){.ll-chat-panel{right:10px;left:10px;width:auto;bottom:92px;height:70vh}.ll-chat-tip{display:none}}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.className = 'll-chat-btn';
  btn.setAttribute('aria-label', 'Chat with the Le Lac assistant');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12z"/></svg>';

  var tip = document.createElement('div');
  tip.className = 'll-chat-tip';
  tip.textContent = 'Questions about a diamond? Ask me.';

  var panel = document.createElement('div');
  panel.className = 'll-chat-panel';
  panel.innerHTML = '<div class="ll-chat-head"><span>Le Lac Assistant</span><button aria-label="Close chat">&times;</button></div>';

  var loaded = false;
  function toggle(open) {
    if (open && !loaded) {
      var f = document.createElement('iframe');
      f.src = BOT_URL; f.title = 'Le Lac Jewelry Assistant'; f.allow = 'clipboard-write';
      panel.appendChild(f); loaded = true;
    }
    panel.classList.toggle('open', open);
    tip.style.opacity = '0';
  }
  btn.addEventListener('click', function () { toggle(!panel.classList.contains('open')); });
  panel.querySelector('button').addEventListener('click', function () { toggle(false); });

  document.body.appendChild(panel);
  document.body.appendChild(tip);
  document.body.appendChild(btn);
  setTimeout(function () { tip.style.opacity = '0'; }, 7000);

  // Any "open the chat" links on the page
  document.querySelectorAll('[data-open-chat]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); toggle(true); });
  });
})();
