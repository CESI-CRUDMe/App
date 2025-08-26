import { Stack, useLocalSearchParams } from 'expo-router';
import PostScreen from '@/screens/articles/PostScreen';

export default function Post() {
    const { id } = useLocalSearchParams();
    return (
        <PostScreen id={id as string} />
    );
}