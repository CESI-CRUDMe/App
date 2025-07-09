import { SafeAreaView, ScrollView, StyleSheet, Text  } from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import Post from "@/components/Post";
import axios from "axios";

/**
 * Interface définissant la structure d'un post
 * À compléter selon les besoins de l'application
 */
interface PostType {
    id: string;
    // ajoutez ici les autres propriétés de votre post
}

/**
 * Écran principal affichant la liste des posts avec pagination infinie
 * Les posts sont chargés par lots de 20 au fur et à mesure du défilement
 */
export default function PostsScreen() {
    // États pour gérer les posts et la pagination
    const [posts, setPosts] = useState<PostType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    /**
     * Récupère une page de posts depuis l'API
     * @param page - Numéro de la page à charger
     */
    const fetchPosts = async (page: number) => {
        // Évite les requêtes inutiles
        if (isLoading || !hasMore) return;
        
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/posts?page=${page}&limit=20`);
            const data = await response.data;
            handlePostsData(data, page);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Traite les données reçues de l'API et met à jour l'état
     * @param data - Données reçues de l'API
     * @param page - Numéro de la page chargée
     */
    const handlePostsData = (data: { posts: PostType[] }, page: number) => {
        // Si on reçoit moins de 20 posts, c'est qu'il n'y en a plus à charger
        if (data.posts.length < 20) {
            setHasMore(false);
        }
        // Ajoute les nouveaux posts à la liste existante
        setPosts(prevPosts => [...prevPosts, ...data.posts]);
        setCurrentPage(page);
    };

    // Charge la première page au montage du composant
    useEffect(() => {
        fetchPosts(1);
    }, []);

    /**
     * Gère le défilement infini
     * Charge plus de posts quand l'utilisateur approche de la fin de la liste
     */
    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
            contentSize.height - (contentSize.height * 0.2); // Déclenche le chargement à 80% du scroll

        if (isCloseToBottom && !isLoading && hasMore) {
            fetchPosts(currentPage + 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.list}
                onScroll={handleScroll}
                scrollEventThrottle={400}
            >
                {posts?.map((post: PostType, index: number) => (
                    <Link href={`/posts/${post.id}`} key={`${post.id}-${index}`}>
                        <Post post={post} />
                    </Link>
                ))}
                {!hasMore && <Text style={styles.noMorePosts}>Vous avez atteint la fin de la liste</Text>}
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles pour le composant
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        width: '100%',
        flex: 1,
        alignItems: 'center',
    },
    list: {
        width: '100%',
    },
    noMorePosts: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        padding: 20,
    },
});