export interface TenantConfig {
  id: string;
  name: string;
  contactEmail: string;
  socials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  defaultLanguage: 'es' | 'en';
}

export const tenantConfig: TenantConfig = {
  id: 'modulacao',
  name: 'Grupo Modulação',
  contactEmail: 'contacto@modulacao.com',
  socials: {
    instagram: 'https://instagram.com/modulacao',
  },
  theme: {
    primaryColor: '#D4AF37', // Gold
    secondaryColor: '#B8860B', // Dark Gold
  },
  defaultLanguage: 'es',
};
