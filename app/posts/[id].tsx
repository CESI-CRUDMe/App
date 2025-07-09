import { useLocalSearchParams } from 'expo-router';
import SoloPostScreen from '@/screens/SoloPostScreen';

export default function Post() {
    const { id } = useLocalSearchParams();
    return (
        <SoloPostScreen id={id as string} />
    );
}