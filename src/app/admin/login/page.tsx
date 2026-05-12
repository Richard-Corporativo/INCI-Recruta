// @route AdminLoginRedirect | @tipo page | @versao 2.0.0
// > Rota legada — redireciona para o login unificado de empresa
// > O middleware já faz esse redirect, mas mantemos o componente por segurança

import { redirect } from 'next/navigation';

export default function AdminLoginRedirect() {
    redirect('/login?type=company');
}
