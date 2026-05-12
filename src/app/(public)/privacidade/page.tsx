'use client';

// @route PrivacyPolicyPage | @tipo page | @versao 1.0.0
// > Política de privacidade — texto legal, LGPD
// @calls PrivacyPolicy — componente principal

import PrivacyPolicy from '@src/views/public/PrivacyPolicy';

export default function Page() {
    return <PrivacyPolicy />;
}
