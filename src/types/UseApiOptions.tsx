export default interface UseApiOptions {
    withAuth?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}