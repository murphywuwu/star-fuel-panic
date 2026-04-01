/**
 * Supabase client for server-side operations.
 * Uses REST API directly for compatibility with both Next.js API routes and standalone workers.
 */

type SupabaseConfig = {
  baseUrl: string;
  serviceRoleKey: string;
};

let cachedConfig: SupabaseConfig | null = null;

export function getSupabaseConfig(): SupabaseConfig | null {
  if (cachedConfig) {
    return cachedConfig;
  }

  const baseUrl =
    process.env.SUPABASE_URL?.trim() ??
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ??
    "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

  if (!baseUrl || !serviceRoleKey) {
    return null;
  }

  cachedConfig = {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    serviceRoleKey
  };

  return cachedConfig;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export type SupabaseQueryOptions = {
  select?: string;
  filter?: string;
  order?: string;
  limit?: number;
  offset?: number;
  single?: boolean;
};

export type SupabaseUpsertOptions = {
  onConflict?: string;
  returning?: "minimal" | "representation";
  ignoreDuplicates?: boolean;
};

function buildQueryString(options: SupabaseQueryOptions): string {
  const params: string[] = [];

  if (options.select) {
    params.push(`select=${encodeURIComponent(options.select)}`);
  }

  if (options.order) {
    params.push(`order=${encodeURIComponent(options.order)}`);
  }

  if (options.limit !== undefined) {
    params.push(`limit=${options.limit}`);
  }

  if (options.offset !== undefined) {
    params.push(`offset=${options.offset}`);
  }

  return params.length > 0 ? `?${params.join("&")}` : "";
}

export async function supabaseSelect<T>(
  table: string,
  options: SupabaseQueryOptions & { filter?: string } = {}
): Promise<T[]> {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn(`[supabaseSelect] Supabase not configured, returning empty array for ${table}`);
    return [];
  }

  const queryString = buildQueryString(options);
  const filterPart = options.filter ? `&${options.filter}` : "";
  const path = `${table}${queryString}${filterPart}`;

  const response = await fetch(`${config.baseUrl}/rest/v1/${path}`, {
    method: "GET",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: options.single ? "return=representation,count=exact" : "return=representation"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SUPABASE_SELECT_${response.status}_${table}: ${body}`);
  }

  const text = await response.text();
  if (!text.trim()) {
    return [];
  }

  return JSON.parse(text) as T[];
}

export async function supabaseSelectOne<T>(
  table: string,
  filter: string,
  options: Omit<SupabaseQueryOptions, "filter" | "single"> = {}
): Promise<T | null> {
  const results = await supabaseSelect<T>(table, { ...options, filter, limit: 1 });
  return results[0] ?? null;
}

export async function supabaseInsert<T>(
  table: string,
  data: Record<string, unknown> | Record<string, unknown>[],
  options: SupabaseUpsertOptions = {}
): Promise<T[]> {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn(`[supabaseInsert] Supabase not configured, skipping insert to ${table}`);
    return [];
  }

  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) {
    return [];
  }

  const prefer = options.returning === "minimal"
    ? "return=minimal"
    : "return=representation";

  const response = await fetch(`${config.baseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: prefer
    },
    body: JSON.stringify(rows),
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SUPABASE_INSERT_${response.status}_${table}: ${body}`);
  }

  if (options.returning === "minimal" || response.status === 204) {
    return [];
  }

  const text = await response.text();
  if (!text.trim()) {
    return [];
  }

  return JSON.parse(text) as T[];
}

export async function supabaseUpsert<T>(
  table: string,
  data: Record<string, unknown> | Record<string, unknown>[],
  options: SupabaseUpsertOptions = {}
): Promise<T[]> {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn(`[supabaseUpsert] Supabase not configured, skipping upsert to ${table}`);
    return [];
  }

  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) {
    return [];
  }

  const onConflict = options.onConflict ? `?on_conflict=${options.onConflict}` : "";
  const prefer = [
    "resolution=merge-duplicates",
    options.returning === "minimal" ? "return=minimal" : "return=representation"
  ].join(",");

  const response = await fetch(`${config.baseUrl}/rest/v1/${table}${onConflict}`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: prefer
    },
    body: JSON.stringify(rows),
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SUPABASE_UPSERT_${response.status}_${table}: ${body}`);
  }

  if (options.returning === "minimal" || response.status === 204) {
    return [];
  }

  const text = await response.text();
  if (!text.trim()) {
    return [];
  }

  return JSON.parse(text) as T[];
}

export async function supabaseUpdate<T>(
  table: string,
  filter: string,
  data: Record<string, unknown>,
  options: { returning?: "minimal" | "representation" } = {}
): Promise<T[]> {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn(`[supabaseUpdate] Supabase not configured, skipping update to ${table}`);
    return [];
  }

  const prefer = options.returning === "minimal"
    ? "return=minimal"
    : "return=representation";

  const response = await fetch(`${config.baseUrl}/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: prefer
    },
    body: JSON.stringify(data),
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SUPABASE_UPDATE_${response.status}_${table}: ${body}`);
  }

  if (options.returning === "minimal" || response.status === 204) {
    return [];
  }

  const text = await response.text();
  if (!text.trim()) {
    return [];
  }

  return JSON.parse(text) as T[];
}

export async function supabaseDelete(
  table: string,
  filter: string
): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) {
    console.warn(`[supabaseDelete] Supabase not configured, skipping delete from ${table}`);
    return;
  }

  const response = await fetch(`${config.baseUrl}/rest/v1/${table}?${filter}`, {
    method: "DELETE",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SUPABASE_DELETE_${response.status}_${table}: ${body}`);
  }
}

export async function supabaseRpc<T>(
  functionName: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(`[supabaseRpc] Supabase not configured for ${functionName}`);
  }

  const response = await fetch(`${config.baseUrl}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params),
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`SUPABASE_RPC_${response.status}_${functionName}: ${body}`);
  }

  const text = await response.text();
  if (!text.trim()) {
    return null as T;
  }

  return JSON.parse(text) as T;
}
