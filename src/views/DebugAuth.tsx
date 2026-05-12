'use client';

// @page DebugAuth | @tipo page-component | @versao 1.0.0
// > Debug de autenticação — estado, sessão, tokens, Supabase
// @calls useAuth — estado, supabase — client direto

import React, { useEffect, useState } from 'react';
import { useAuth } from '@src/hooks/useAuth';
import { supabase } from '@src/lib/supabase';

const DebugAuth: React.FC = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [session, setSession] = useState<any>(null);
    const [dbCheck, setDbCheck] = useState<any>('Testando...');
    const [rlsCheck, setRlsCheck] = useState<any>('Testando...');

    useEffect(() => {
        // 1. Pega sessão bruta do Supabase
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        // 2. Testa leitura pública do próprio usuário (simulando o fetchProfile)
        const checkDb = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                setDbCheck('Sem usuário logado no Auth para testar DB');
                setRlsCheck('Pular');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .maybeSingle();

                if (error) setDbCheck({ error });
                else setDbCheck({ found: !!data, data });
            } catch (err) {
                setDbCheck({ exception: err });
            }

            // 3. Testa permissões gerais (listar users) - deve falhar se RLS estiver on e user não for admin
            try {
                const { count, error } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true });
                setRlsCheck({ count, error });
            } catch (err) {
                setRlsCheck({ exception: err });
            }
        };

        checkDb();
    }, []);

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-sm max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4 border-b pb-2">Diagnóstico de Autenticação</h1>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-600">1. Estado do Contexto (AuthContext)</h2>
                <div className="bg-white p-4 border rounded overflow-auto max-h-60">
                    <pre>{JSON.stringify({ isAuthenticated, isLoading: authLoading, user }, null, 2)}</pre>
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold text-green-600">2. Sessão Supabase (Raw)</h2>
                <div className="bg-white p-4 border rounded overflow-auto max-h-60">
                    {session ? (
                        <>
                            <p><strong>Email:</strong> {session.user.email}</p>
                            <p><strong>ID:</strong> {session.user.id}</p>
                            <p><strong>Role (JWT):</strong> {session.user.role}</p>
                            <p><strong>Metadados:</strong></p>
                            <pre>{JSON.stringify(session.user.user_metadata, null, 2)}</pre>
                        </>
                    ) : (
                        <p className="text-red-500">Nenhuma sessão ativa.</p>
                    )}
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold text-purple-600">3. Teste de Banco de Dados (Tabela 'users')</h2>
                <div className="bg-white p-4 border rounded overflow-auto">
                    <p className="mb-2 text-slate-500">Tentativa de ler o registro do usuário atual:</p>
                    <pre>{JSON.stringify(dbCheck, null, 2)}</pre>
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-semibold text-orange-600">4. Teste de RLS (Permissões)</h2>
                <div className="bg-white p-4 border rounded overflow-auto">
                    <p className="mb-2 text-slate-500">Head request na tabela users:</p>
                    <pre>{JSON.stringify(rlsCheck, null, 2)}</pre>
                </div>
            </section>

            <div className="pt-8 flex gap-4">
                <button
                    onClick={() => window.location.href = '/admin/login'}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Ir para Login
                </button>
                <button
                    onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Forçar Logout
                </button>
            </div>
        </div>
    );
};

export default DebugAuth;
