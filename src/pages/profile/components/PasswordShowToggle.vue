<template>
  <div class="password-toggle">
    <input
      class="form-control"
      :type="visible ? 'text' : 'password'"
      :id="id"
      :value="modelValue"
      @input="updateValue"
      :disabled="disabled"
    />
    <label class="password-toggle-btn" aria-label="Show/hide password">
      <input
        class="password-toggle-check"
        type="checkbox"
        :checked="visible"
        @change="visible = !visible"
        :disabled="false"
      />
      <span class="password-toggle-indicator"></span>
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String,
  id: String,
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)

const updateValue = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>