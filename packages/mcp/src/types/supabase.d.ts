declare module '@supabase/supabase-js' {
  export interface SupabaseClientOptions {
    schema?: string;
    autoRefreshToken?: boolean;
    persistSession?: boolean;
    detectSessionInUrl?: boolean;
    localStorage?: Storage;
    headers?: { [key: string]: string };
    auth?: {
      autoRefreshToken?: boolean;
      detectSessionInUrl?: boolean;
      persistSession?: boolean;
      storage?: Storage;
      storageKey?: string;
      flowType?: 'implicit' | 'pkce';
      debug?: boolean;
    };
  }

  export interface PostgrestResponse<T> {
    data: T | null;
    error: Error | null;
    status: number;
    statusText: string;
    count: number | null;
  }

  export interface PostgrestSingleResponse<T> extends PostgrestResponse<T> {
    data: T;
  }

  export interface PostgrestMaybeSingleResponse<T> extends PostgrestResponse<T> {
    data: T | null;
  }

  export interface PostgrestFilterBuilder<T> {
    select(columns?: string): this;
    eq(column: string, value: any): this;
    neq(column: string, value: any): this;
    gt(column: string, value: any): this;
    gte(column: string, value: any): this;
    lt(column: string, value: any): this;
    lte(column: string, value: any): this;
    like(column: string, pattern: string): this;
    ilike(column: string, pattern: string): this;
    is(column: string, value: any): this;
    in(column: string, values: any[]): this;
    contains(column: string, value: any): this;
    cs(column: string, value: any): this;
    cd(column: string, value: any): this;
    not(column: string, operator: string, value: any): this;
    or(filters: string, options?: { foreignTable?: string }): this;
    order(column: string, options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string }): this;
    limit(count: number, options?: { foreignTable?: string }): this;
    range(from: number, to: number, options?: { foreignTable?: string }): this;
    single(): Promise<PostgrestSingleResponse<T>>;
    maybeSingle(): Promise<PostgrestMaybeSingleResponse<T>>;
    // Add other methods as needed
  }

  export interface SupabaseClient {
    from<T = any>(table: string): PostgrestFilterBuilder<T>;
    auth: {
      signIn(credentials: { email: string; password: string }): Promise<{ data: any; error: Error | null }>;
      signUp(credentials: { email: string; password: string }): Promise<{ data: any; error: Error | null }>;
      signOut(): Promise<{ error: Error | null }>;
      user(): any;
      session(): any;
      onAuthStateChange(callback: (event: string, session: any) => void): { data: { subscription: { unsubscribe: () => void } } };
      // Add other auth methods as needed
    };
    // Add other Supabase client methods as needed
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions
  ): SupabaseClient;
}
