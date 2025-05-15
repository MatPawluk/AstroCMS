<template>
	<div class="w-full">
		<label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
			{{ label }}
		</label>

		<div class="relative">
			<input
				:id="id"
				:value="modelValue"
				:type="type"
				:placeholder="placeholder"
				:disabled="disabled"
				:required="required"
				:class="[
					'block w-full rounded-md border-gray-300 shadow-sm',
					'focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
					'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-75',
					hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
					className,
				]"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
				@blur="$emit('blur', $event)" />
		</div>

		<p v-if="hasError" class="mt-1 text-xs text-red-600">
			{{ errorMessage }}
		</p>

		<p v-else-if="helpText" class="mt-1 text-xs text-gray-500">
			{{ helpText }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	id: {
		type: String,
		default: () => `input-${Math.random().toString(36).substring(2, 9)}`,
	},
	label: {
		type: String,
		default: '',
	},
	type: {
		type: String,
		default: 'text',
	},
	placeholder: {
		type: String,
		default: '',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	required: {
		type: Boolean,
		default: false,
	},
	error: {
		type: [String, Boolean],
		default: false,
	},
	helpText: {
		type: String,
		default: '',
	},
	className: {
		type: String,
		default: '',
	},
});

defineEmits(['update:modelValue', 'blur']);

const hasError = computed(() => Boolean(props.error));
const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : ''));
</script>
