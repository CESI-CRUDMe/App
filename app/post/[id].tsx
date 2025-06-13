import PostScreen from "@/screens/articles/PostScreen";
import { useLocalSearchParams } from "expo-router";

export default function Post() {
    const { id } = useLocalSearchParams();
    return <PostScreen id={id.toString()} />;
}