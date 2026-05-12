import SuperAdminCompanyDetail from '@src/views/super-admin/SuperAdminCompanyDetail';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: Props) {
    const { id } = await params;
    return <SuperAdminCompanyDetail companyId={id} />;
}
