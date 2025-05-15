import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp,
  type DocumentData 
} from 'firebase/firestore';
import { ref, type Ref } from 'vue';

// Konfiguracja Firebase
// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

// Inicjalizacja Firebase - sprawdzamy czy aplikacja już istnieje
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Użyj istniejącej instancji aplikacji
}

const auth = getAuth(app);
const db = getFirestore(app);

// Definicje typów
export interface Post {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishedAt: Timestamp | null;
  updatedAt: Timestamp | null;
  isPublished: boolean;
  author: string;
}

// Reactive użytkownik dla komponentów Vue
const currentUser: Ref<User | null> = ref(null);

// Nasłuchiwanie zmian stanu uwierzytelnienia tylko po stronie klienta
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
  });
}

// Funkcje uwierzytelniania
export const useAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    currentUser,
    login,
    register,
    logout
  };
};

// Funkcje CRUD dla postów
export const usePostsStore = () => {
  const postsCollection = collection(db, 'posts');

  const getAllPosts = async (onlyPublished = false) => {
    try {
      let q = query(postsCollection, orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));
      
      return onlyPublished ? posts.filter(post => post.isPublished) : posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  };

  const getPostById = async (id: string) => {
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Post;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  };

  const getPostBySlug = async (slug: string) => {
    try {
      const q = query(postsCollection);
      const querySnapshot = await getDocs(q);
      
      const post = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Post))
        .find(post => post.slug === slug);
      
      return post || null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  };

  const createPost = async (postData: Omit<Post, 'id'>) => {
    try {
      const timestamp = Timestamp.now();
      const newPost = {
        ...postData,
        publishedAt: postData.isPublished ? timestamp : null,
        updatedAt: timestamp
      };
      
      const docRef = await addDoc(postsCollection, newPost);
      return { id: docRef.id, ...newPost } as Post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const updatePost = async (id: string, postData: Partial<Post>) => {
    try {
      const docRef = doc(db, 'posts', id);
      const timestamp = Timestamp.now();
      
      const updateData = {
        ...postData,
        updatedAt: timestamp,
        // Aktualizuj publishedAt tylko gdy post jest publikowany po raz pierwszy
        ...(postData.isPublished && { publishedAt: timestamp })
      };
      
      await updateDoc(docRef, updateData as DocumentData);
      
      // Pobierz zaktualizowany dokument
      const updatedDoc = await getDoc(docRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as Post;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const docRef = doc(db, 'posts', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  return {
    getAllPosts,
    getPostById,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost
  };
};

export { auth, db };