export default interface PostType {
    id: number | string;
    title?: string;
    content?: string;
    price?: string | number;
    latitude?: string | number | null;
    longitude?: string | number | null;
    contact_name?: string;
    contact_phone?: string;
    image_base64?: string | null; // peut être data URI ou base64 brut
    created_at?: string | Date;
    updated_at?: string | Date;
    [key: string]: any;
}