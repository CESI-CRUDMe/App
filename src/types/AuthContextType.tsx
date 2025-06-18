export default interface AuthContextType {
    token: string | null;
    fetchToken: () => Promise<void>;
}