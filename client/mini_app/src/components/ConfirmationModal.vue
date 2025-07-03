<template>
    <div class="modal" @click.self="$emit('cancel')">
      <div class="modal-content">
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="$emit('confirm')">
            Да
          </button>
          <button class="btn btn-secondary" @click="$emit('cancel')">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmationModal',
    props: {
      message: {
        type: String,
        required: true
      }
    },
    emits: ['confirm', 'cancel']
  }
  </script>
  