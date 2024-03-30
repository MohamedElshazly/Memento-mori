import type { QueryClient } from '@tanstack/svelte-query';
import { writable } from 'svelte/store';

export const queryClientStore = writable<QueryClient>();
