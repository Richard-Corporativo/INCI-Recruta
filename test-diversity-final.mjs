import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🔹 Navegando para configurações...');
    await page.goto('http://localhost:3000/candidate/settings', { waitUntil: 'domcontentloaded', timeout: 10000 });

    // Aguarda seção de Diversidade carregar
    await page.waitForSelector('text=Diversidade', { timeout: 5000 });
    console.log('✅ Seção de Diversidade carregou');

    // Abre a seção de Diversidade
    const diversidadeBtn = await page.locator('text=Diversidade').first();
    await diversidadeBtn.click();
    await page.waitForTimeout(500);

    console.log('\n📍 TESTE 1: Toggle em Gênero');
    const masculinoBtn = await page.locator('text=MASCULINO').first();

    // Click 1: seleciona
    console.log('  Clicando em Masculino (1ª vez)...');
    await masculinoBtn.click();
    await page.waitForTimeout(300);

    let isBorder = await masculinoBtn.evaluate(el => el.className.includes('border-primary'));
    console.log(`  ${isBorder ? '✅' : '❌'} Masculino ${isBorder ? 'selecionado' : 'NÃO selecionado'}`);

    if (!isBorder) {
      console.log('❌ FALHA: Esperado que Masculino ficasse selecionado após click');
      process.exit(1);
    }

    // Click 2: desseleciona
    console.log('  Clicando em Masculino (2ª vez)...');
    await masculinoBtn.click();
    await page.waitForTimeout(300);

    isBorder = await masculinoBtn.evaluate(el => el.className.includes('border-primary'));
    console.log(`  ${!isBorder ? '✅' : '❌'} Masculino ${!isBorder ? 'deseleccionado' : 'AINDA SELECIONADO'}`);

    if (isBorder) {
      console.log('❌ FALHA: Esperado que Masculino fosse deseleccionado após 2º click');
      process.exit(1);
    }

    console.log('\n📍 TESTE 2: Toggle em Raça/Cor');
    const pardaBtn = await page.locator('text=PARDA').first();

    // Click 1
    console.log('  Clicando em Parda (1ª vez)...');
    await pardaBtn.click();
    await page.waitForTimeout(300);

    isBorder = await pardaBtn.evaluate(el => el.className.includes('border-primary'));
    console.log(`  ${isBorder ? '✅' : '❌'} Parda ${isBorder ? 'selecionada' : 'NÃO selecionada'}`);

    if (!isBorder) {
      console.log('❌ FALHA: Esperado que Parda ficasse selecionada');
      process.exit(1);
    }

    // Click 2
    console.log('  Clicando em Parda (2ª vez)...');
    await pardaBtn.click();
    await page.waitForTimeout(300);

    isBorder = await pardaBtn.evaluate(el => el.className.includes('border-primary'));
    console.log(`  ${!isBorder ? '✅' : '❌'} Parda ${!isBorder ? 'deseleccionada' : 'AINDA SELECIONADA'}`);

    if (isBorder) {
      console.log('❌ FALHA: Esperado que Parda fosse deseleccionada');
      process.exit(1);
    }

    console.log('\n✅ TODOS OS TESTES PASSARAM!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
