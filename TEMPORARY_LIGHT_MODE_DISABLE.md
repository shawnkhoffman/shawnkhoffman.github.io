# Temporary Light Mode Disable

This document tracks the temporary changes made to disable light mode. These changes should be reverted when light mode is re-enabled.

## Files Modified

### 1. `src/composables/useTheme.ts`
- **Line 7**: Changed default theme from `(localStorage.getItem('theme') as Theme) || 'system'` to `'dark'`
- **Line 11**: `applyTheme` now always applies `'dark'` instead of respecting `currentTheme`
- **Line 28**: Removed `localStorage.setItem('theme', newTheme);` from watch callback
- **Lines 31-42**: Removed system theme watching (media query listener and cleanup)
- **Line 32**: `setTheme` now always sets to `'dark'` instead of `newTheme`
- **Removed**: `onUnmounted` import and cleanup code

### 2. `src/components/common/ThemeController.vue`
- **Line 54**: Changed `THEME_ORDER` from `['light', 'dark', 'system']` to `['dark']`

### 3. `src/layouts/MainLayout.vue`
- **Removed imports**: `useTheme`, `useMediaQuery`, `watch`, `ref` (kept `ref` for velocity), `onMounted`, `onUnmounted`
- **Removed**: All theme detection logic (`appliedTheme`, `isDarkMode`, `updateAppliedTheme`, `MutationObserver`)
- **Line 45**: Changed `shouldShowStarfield` from `isLandingPage.value && isDarkMode.value` to `isLandingPage.value`
- **Line 46**: Changed `shouldShowClouds` from `isLandingPage.value && !isDarkMode.value` to `false`

### 4. `src/views/Index.vue`
- **Removed imports**: `useTheme`, `useMediaQuery`
- **Removed**: `appliedTheme` computed property
- **Line 33**: Changed `shouldShowStarfield` from `isLandingPage.value && appliedTheme.value === 'dark'` to `isLandingPage.value`

## To Re-enable Light Mode

Revert all the changes listed above to restore full theme switching functionality.

