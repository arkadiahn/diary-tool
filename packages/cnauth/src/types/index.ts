type ISODateString = string;

export interface User {
    id: number;
    name: string;
    email: string;
    image: string;
}

export interface Session {
    user?: User;
    expires: ISODateString;
}

export interface UseSessionOptions<R extends boolean> {
    required?: R;
    onRequiredUnauthenticated?: () => void;
}

export interface SessionProviderProps {
    children: React.ReactNode;
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
}

export interface AuthConfig {
    baseUrl: string;
    loginEndpoint: string;
    signoutEndpoint: string;
    sessionEndpoint: string;
}

export interface GlobalState extends AuthConfig {
    _lastSync: number;
    _session?: Session | null;
    _getSession: (params?: { event?: string }) => Promise<void>;
}
