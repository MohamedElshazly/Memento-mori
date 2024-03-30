// src/app.d.ts

import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
			session: Session | null;
		}
		interface PageData {
			session: Session | null;
		}
		interface Parent {
			queryClient: QueryClient;
		}
		// interface Error {}
		// interface Platform {}
	}
}
