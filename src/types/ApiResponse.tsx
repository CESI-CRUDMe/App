import ApiErrorResponse from "./ApiErrorResponse";

export default interface ApiResponse<T> {
    data: T | null;
    error: ApiErrorResponse | null;
    status: number;
    isLoading: boolean;
}