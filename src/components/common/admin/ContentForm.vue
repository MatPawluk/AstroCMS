<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { usePostsStore, useAuth, type Post } from '../../../lib/firebase';
import Button from '../../ui/Button.vue';
import Input from '../../ui/Input.vue';
import Alert from '../../ui/Alert.vue';

// Props
const props = defineProps({
	postId: {
		type: String,
		default: '',
	},
});

// Emity
const emit = defineEmits(['cancel', 'saved']);

// Stan
const isSubmitting = ref(false);
const error = ref('');
const postsStore = usePostsStore();
const auth = useAuth();

// Formularz
const form = reactive({
	title: '',
	slug: '',
	content: '',
	excerpt: '',
	isPublished: false,
});

// Walidacja
const validation = reactive({
	title: '',
	slug: '',
	content: '',
});

// Sprawdzenie czy edytujemy istniejący wpis
const isEditing = computed(() => Boolean(props.postId));

// Generowanie sluga z tytułu
const generateSlug = () => {
	if (!form.title) return;

	// Nie generuj automatycznie sluga podczas edycji, chyba że użytkownik edytuje tytuł
	if (isEditing.value && form.slug && !form.title.toLowerCase().includes(form.slug)) {
		return;
	}

	form.slug = form.title
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Usuń znaki specjalne
		.replace(/\s+/g, '-') // Zamień spacje na myślniki
		.replace(/-+/g, '-') // Usuń powtarzające się myślniki
		.trim();
};

// Walidacja pól
const validateTitle = () => {
	if (!form.title) {
		validation.title = 'Tytuł jest wymagany';
		return false;
	}

	validation.title = '';
	return true;
};

const validateSlug = () => {
	if (!form.slug) {
		validation.slug = 'Slug jest wymagany';
		return false;
	}

	// Sprawdź format sluga
	const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	if (!slugRegex.test(form.slug)) {
		validation.slug = 'Slug może zawierać tylko małe litery, cyfry i myślniki';
		return false;
	}

	validation.slug = '';
	return true;
};

const validateContent = () => {
	if (!form.content) {
		validation.content = 'Treść jest wymagana';
		return false;
	}

	validation.content = '';
	return true;
};

// Walidacja całego formularza
const validateForm = () => {
	const isTitleValid = validateTitle();
	const isSlugValid = validateSlug();
	const isContentValid = validateContent();

	return isTitleValid && isSlugValid && isContentValid;
};

// Pobieranie danych posta do edycji
const fetchPost = async () => {
	if (!props.postId) return;

	try {
		const post = await postsStore.getPostById(props.postId);

		if (post) {
			form.title = post.title;
			form.slug = post.slug;
			form.content = post.content;
			form.excerpt = post.excerpt || '';
			form.isPublished = post.isPublished;
		}
	} catch (err) {
		console.error('Error fetching post:', err);
		error.value = 'Nie udało się pobrać danych wpisu. Spróbuj ponownie.';
	}
};

// Zapisywanie formularza
const handleSubmit = async () => {
	if (!validateForm()) return;

	isSubmitting.value = true;
	error.value = '';

	try {
		const currentUser = auth.currentUser.value;

		if (!currentUser) {
			error.value = 'Musisz być zalogowany, aby dodać lub edytować wpis.';
			isSubmitting.value = false;
			return;
		}

		const postData = {
			title: form.title,
			slug: form.slug,
			content: form.content,
			excerpt: form.excerpt || null,
			isPublished: form.isPublished,
			author: currentUser.email || 'unknown',
		};

		let savedPost;

		if (isEditing.value) {
			savedPost = await postsStore.updatePost(props.postId, postData);
		} else {
			savedPost = await postsStore.createPost(postData as Omit<Post, 'id'>);
		}

		emit('saved', savedPost);
	} catch (err) {
		console.error('Error saving post:', err);
		error.value = `Nie udało się ${isEditing.value ? 'zaktualizować' : 'utworzyć'} wpisu. Spróbuj ponownie.`;
	} finally {
		isSubmitting.value = false;
	}
};

// Pobierz dane posta przy montowaniu komponentu
onMounted(() => {
	if (props.postId) {
		fetchPost();
	}
});
</script>
