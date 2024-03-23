import type { Database } from './schema';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Weeks = Database['public']['Tables']['weeks']['Row'];
export type Notes = Database['public']['Tables']['notes']['Row'];
