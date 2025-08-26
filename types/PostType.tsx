export default interface PostType {
    id: number | string;
    title?: string;
    content?: string;
    [key: string]: any;
}