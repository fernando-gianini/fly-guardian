export enum Roles {
  admin_global = 'admin_global',
  cliente = 'cliente',
  operador = 'operador',
  morador = 'morador',
}

export type Role = `${Roles}`;

export const ALL_ROLES: Role[] = Object.freeze(Object.values(Roles) as Role[]);
