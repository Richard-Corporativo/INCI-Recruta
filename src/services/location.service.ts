/**
 * @service LocationService
 * @description Serviço para buscar estados e cidades do Brasil usando a API do IBGE
 */

export interface State {
    id: number;
    sigla: string;
    nome: string;
}

export interface City {
    id: number;
    nome: string;
    uf: string;
}

const CACHE_KEY = 'ibge_cities_cache';
const CACHE_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 dias

class LocationService {
    private baseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades';

    /**
     * Busca todos os estados do Brasil
     */
    async getStates(): Promise<State[]> {
        try {
            const response = await fetch(`${this.baseUrl}/estados?orderBy=nome`);
            if (!response.ok) throw new Error('Erro ao buscar estados');
            return await response.json();
        } catch (error) {
            console.error('LocationService.getStates:', error);
            return [];
        }
    }

    /**
     * Busca todas as cidades do Brasil
     * Nota: São cerca de 5.500 cidades. Implementa cache local.
     */
    async getAllCities(): Promise<City[]> {
        try {
            // Tentar recuperar do cache
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_EXPIRATION) {
                        return data;
                    }
                }
            }

            const response = await fetch(`${this.baseUrl}/municipios?orderBy=nome`);
            
            if (!response.ok) {
                console.error(`IBGE API Error: ${response.status} ${response.statusText}`);
                throw new Error('Erro ao buscar cidades da API do IBGE');
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                console.error('IBGE API returned non-array data:', data);
                return [];
            }

            const mappedCities = data.map((city: any) => ({
                id: city.id,
                nome: city.nome,
                uf: city.microrregiao?.mesorregiao?.UF?.sigla || 
                    city['regiao-imediata']?.['regiao-intermediaria']?.UF?.sigla || 
                    '??'
            }));

            // Salvar no cache
            if (typeof window !== 'undefined') {
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: mappedCities,
                    timestamp: Date.now()
                }));
            }

            return mappedCities;
        } catch (error) {
            console.error('LocationService.getAllCities:', error);
            return [];
        }
    }
}

export default new LocationService();
