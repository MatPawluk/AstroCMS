<template>
    <aside class="w-64 h-full bg-gray-50 border-r border-gray-200">
      <div class="flex flex-col h-full">
        <!-- Nagłówek sidebar -->
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Panel administratora</h2>
        </div>
        
        <!-- Menu -->
        <nav class="flex-1 p-4 overflow-y-auto">
          <ul class="space-y-1">
            <li>
              <a 
                href="/admin" 
                :class="[
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  isActive('/admin') && !isActive('/admin/posts') && !isActive('/admin/settings')
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="/admin/posts" 
                :class="[
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  isActive('/admin/posts') 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
                Wpisy
              </a>
            </li>
            <li>
              <a 
                href="/admin/settings" 
                :class="[
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  isActive('/admin/settings') 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                Ustawienia
              </a>
            </li>
          </ul>
        </nav>
        
        <!-- Stopka sidebar -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700" v-if="currentUser">
                {{ currentUser.email }}
              </p>
              <button 
                @click="handleLogout" 
                class="text-xs font-medium text-primary-600 hover:text-primary-500"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </template>
  
  <script setup lang="ts">
  import { useAuth } from '../../lib/firebase';
  import { onMounted, ref } from 'vue';
  
  // Stan
  const { currentUser, logout } = useAuth();
  const currentPath = ref('');
  
  // Pobierz aktualną ścieżkę
  onMounted(() => {
    currentPath.value = window.location.pathname;
  });
  
  // Sprawdź, czy link jest aktywny
  const isActive = (path: string) => {
    return currentPath.value.startsWith(path);
  };
  
  // Obsługa wylogowania
  const handleLogout = async () => {
    try {
      const { success, error } = await logout();
      
      if (error) {
        console.error('Error during logout:', error);
        return;
      }
      
      // Przekierowanie do strony logowania po wylogowaniu
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };
  </script>