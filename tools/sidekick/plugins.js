// This file contains the nr-specific plugins for the sidekick.
(() => {
  const sk = window.hlx && window.hlx.sidekick ? window.hlx.sidekick : window.hlxSidekick;
  if (typeof sk !== 'object') return;
  sk.add({
    id: 'preview',
    override: true,
    condition: (sidekick) => sidekick.isEditor() || (sidekick.isHelix() && sidekick.config.host),
    button: {
      action: async () => {
        const { config, location } = sk;
        sk.showModal('Please wait...');
        let url;
        if (sk.isEditor()) {
          url = new URL('https://adobeioruntime.net/api/v1/web/helix/helix-services/gdrive-preview@0.0.1');
          url.search = new URLSearchParams([
            ['owner', config.owner],
            ['repo', config.repo],
            ['ref', config.ref || 'main'],
            ['path', '/'],
            ['lookup', location.href],
          ]).toString();
        } else {
          const host = location.host === config.innerHost ? config.host : config.innerHost;
          url = new URL(`https://${host}${location.pathname}`);
        }
        window.open(url.toString(), `hlx-sk-preview-${btoa(location.href)}`);
      },
    },
  });
})();