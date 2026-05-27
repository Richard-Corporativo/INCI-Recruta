import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🔹 Navegando para homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    
    const url = page.url();
    console.log(`Redirecionado para: ${url}`);

    // Tenta buscar o código do componente pelo localStorage ou sessão
    console.log('✅ Servidor está respondendo');

    // Se está na página, tira um screenshot para verificar
    await page.screenshot({ path: '/tmp/homepage.png' });
    console.log('📸 Screenshot salvo: /tmp/homepage.png');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
