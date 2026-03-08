<template>
  <div class="modal-overlay" @click="emit('cancel')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Unlink Plex Account</h3>
        <button class="close-btn" @click="emit('cancel')">
          <IconClose />
        </button>
      </div>
      <div class="modal-body">
        <p>
          Are you sure you want to unlink your Plex account? You will lose
          access to:
        </p>
        <ul>
          <li>Watch history tracking</li>
          <li>Recently added content notifications</li>
          <li>Real-time download progress</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="emit('cancel')">Cancel</button>
        <button class="confirm-btn" @click="emit('confirm')">
          Unlink Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import IconClose from "@/icons/IconClose.vue";

  const emit = defineEmits<{
    (e: "confirm"): void;
    (e: "cancel"): void;
  }>();
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: #1a1a1a;
    border-radius: 12px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #333;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 20px;
    color: #fff;
  }

  .close-btn {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #333;
    color: #fff;
  }

  .modal-body {
    padding: 24px;
  }

  .modal-body p {
    margin: 0 0 16px;
    color: #ccc;
    font-size: 14px;
    line-height: 1.6;
  }

  .modal-body ul {
    margin: 0;
    padding-left: 20px;
    color: #aaa;
    font-size: 14px;
    line-height: 1.8;
  }

  .modal-body li {
    margin-bottom: 8px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #333;
  }

  .cancel-btn,
  .confirm-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .cancel-btn {
    background: #333;
    color: #fff;
  }

  .cancel-btn:hover {
    background: #444;
  }

  .confirm-btn {
    background: #dc2626;
    color: #fff;
  }

  .confirm-btn:hover {
    background: #b91c1c;
  }
</style>
