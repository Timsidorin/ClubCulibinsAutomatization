<template>
  <div class="user-profile">
    <div class="user-avatar">
      <img
        v-if="user.photo_url"
        :src="user.photo_url"
        :alt="user.first_name"
        class="avatar-image"
      />
      <div v-else class="avatar-placeholder">
        {{ getInitials(user.first_name, user.last_name) }}
      </div>
    </div>
    <div class="user-info">
      <div class="user-name">{{ getUserDisplayName() }}</div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'UserProfile',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({
        first_name: '',
        last_name: '',
        username: '',
        photo_url: null
      })
    },
    showUserId: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const getInitials = (firstName, lastName) => {
      const first = firstName ? firstName.charAt(0).toUpperCase() : ''
      const last = lastName ? lastName.charAt(0).toUpperCase() : ''
      return first + last || '?'
    }

    const getUserDisplayName = () => {
      const { first_name, last_name, username } = props.user

      if (first_name && last_name) {
        return `${first_name} ${last_name}`
      } else if (first_name) {
        return first_name
      } else if (username) {
        return `@${username}`
      }
      return 'Пользователь'
    }

    return {
      getInitials,
      getUserDisplayName
    }
  }
}
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, var(--tg-blue-light) 0%, rgba(224, 242, 255, 0.5) 100%);
  border-radius: var(--border-radius-button);
  cursor: pointer;
  transition: all var(--transition-speed);
  border: 2px solid transparent;
  min-width: 0;
  max-width: 280px;
}

.user-profile:hover {
  transform: translateY(-2px);
  border-color: var(--tg-blue);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--tg-blue) 0%, var(--tg-blue-dark) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: var(--tg-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  line-height: 1.3;
}

.user-id {
  font-size: 12px;
  color: var(--tg-text-light);
  line-height: 1.2;
  opacity: 0.8;
}

/* Планшеты */
@media (max-width: 768px) {
  .user-profile {
    padding: 10px 12px;
    gap: 10px;
    max-width: 240px;
  }

  .user-avatar {
    width: 42px;
    height: 42px;
    border-width: 2px;
  }

  .avatar-placeholder {
    font-size: 16px;
  }

  .user-name {
    font-size: 14px;
  }

  .user-id {
    font-size: 11px;
  }
}

/* Мобильные устройства */
@media (max-width: 480px) {
  .user-profile {
    padding: 8px 10px;
    gap: 8px;
    max-width: 200px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
  }

  .avatar-placeholder {
    font-size: 14px;
  }

  .user-name {
    font-size: 13px;
  }

  .user-id {
    font-size: 10px;
  }
}

@media (max-width: 360px) {
  .user-profile {
    padding: 6px 8px;
    gap: 6px;
    max-width: 160px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .avatar-placeholder {
    font-size: 12px;
  }

  .user-name {
    font-size: 12px;
  }

}
</style>
