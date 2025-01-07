import { NextRequest } from "next/server";

type ISODateString = string;

/* -------------------------- @todo make definable -------------------------- */
export interface User {
    id: number;
    nickName: string;
    email: string;
    imageURI: string;
	scopes: string[];
}

export interface Session {
    user: User;
    // expires: ISODateString;
	// @todo implement
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
	apiUrl: string;		// apiUrl is the url of the backend
	baseUrl: string;	// baseUrl is the url of the current application
	baseApiUrl: string;	// baseApiUrl is the url of the backend api
    loginEndpoint: string;
    signoutEndpoint: string;
    sessionEndpoint: string;
}

export interface GlobalState extends AuthConfig {
    _lastSync: number;
    _session?: Session | null;
    _getSession: (params?: { event?: string }) => Promise<void>;
}

export type NextRequestWrapper = {
	request: NextRequest;
	params?: Record<string, string | string[]>;
};
  
export type RouteHandlerCallback = (req: NextRequestWrapper) => Promise<Response> | Response;
