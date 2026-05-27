const { chromium } = require('playwright');

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

    // ============================================
    // TESTE 1: Ícone em "Não Informar" de Raça/Cor
    // ============================================
    console.log('\n📍 TESTE 1: Verificando ícone em "Não Informar" de Raça/Cor');
    const raceButtons = await page.locator('text=NÃO INFORMAR').all();

    if (raceButtons.length < 2) {
      console.log('❌ Esperado 2 botões "NÃO INFORMAR" (Gênero + Raça)');
      process.exit(1);
    }

    const genderNaoInformarBtn = raceButtons[0]; // Gênero
    const raceNaoInformarBtn = raceButtons[1];    // Raça

    // Verifica ícone em Gênero (deve ter)
    const genderIcon = await genderNaoInformarBtn.locator('use-icon').first();
    const hasGenderIcon = await genderIcon.isVisible().catch(() => false);
    console.log(`${hasGenderIcon ? '✅' : '❌'} Gênero "Não Informar" ${hasGenderIcon ? 'tem ícone' : 'SEM ícone'}`);

    // Verifica ícone em Raça (DEVE ter agora depois da mudança)
    const raceIcon = await raceNaoInformarBtn.locator('use-icon').first();
    const hasRaceIcon = await raceIcon.isVisible().catch(() => false);
    console.log(`${hasRaceIcon ? '✅' : '❌'} Raça "Não Informar" ${hasRaceIcon ? 'tem ícone' : 'SEM ícone'}`);

    if (!hasRaceIcon) {
      console.log('❌ FALHA: Ícone não aparece em Raça/Cor "Não Informar"');
      process.exit(1);
    }

    // ============================================
    // TESTE 2: Toggle funciona
    // ============================================
    console.log('\n📍 TESTE 2: Testando toggle');

    // Encontra botão "Masculino" em Gênero
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

    // ============================================
    // TESTE 3: Toggle em Raça/Cor
    // ============================================
    console.log('\n📍 TESTE 3: Testando toggle em Raça/Cor');

    const purdaBtn = await page.locator('text=PARDA').first();

    // Click 1
    console.log('  Clicando em Parda (1ª vez)...');
    await purdaBtn.click();
    await page.waitForTimeout(300);

    isBorder = await purdaBtn.evaluate(el => el.className.includes('border-primary'));
    console.log(`  ${isBorder ? '✅' : '❌'} Parda ${isBorder ? 'selecionada' : 'NÃO selecionada'}`);

    if (!isBorder) {
      console.log('❌ FALHA: Esperado que Parda ficasse selecionada');
      process.exit(1);
    }

    // Click 2
    console.log('  Clicando em Parda (2ª vez)...');
    await purdaBtn.click();
    await page.waitForTimeout(300);

    isBorder = await purdaBtn.evaluate(el => el.className.includes('border-primary'));
    console.log(`  ${!isBorder ? '✅' : '❌'} Parda ${!isBorder ? 'deseleccionada' : 'AINDA SELECIONADA'}`);

    if (isBorder) {
      console.log('❌ FALHA: Esperado que Parda fosse deseleccionada');
      process.exit(1);
    }

    console.log('\n✅ TODOS OS TESTES PASSARAM!');
    console.log('  ✅ Ícone "block" aparece em "Não Informar" de Raça/Cor');
    console.log('  ✅ Toggle funciona em Gênero');
    console.log('  ✅ Toggle funciona em Raça/Cor');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
