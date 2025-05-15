<template>
	<button
		:class="[
			'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
			'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
			variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
			variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:ring-gray-500',
			variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
			variant === 'ghost' && 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
			disabled && 'opacity-50 cursor-not-allowed',
			size === 'sm' && 'text-xs px-2.5 py-1.5',
			size === 'md' && 'text-sm px-4 py-2',
			size === 'lg' && 'text-base px-5 py-2.5',
			fullWidth && 'w-full',
			className,
		]"
		:disabled="disabled"
		:type="type"
		@click="$emit('click', $event)">
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
defineProps({
	variant: {
		type: String,
		default: 'primary',
		validator: (value: string) => ['primary', 'secondary', 'danger', 'ghost'].includes(value),
	},
	size: {
		type: String,
		default: 'md',
		validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
	},
	type: {
		type: String,
		default: 'button',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	fullWidth: {
		type: Boolean,
		default: false,
	},
	className: {
		type: String,
		default: '',
	},
});

defineEmits(['click']);
</script>
